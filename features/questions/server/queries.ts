import type { AnswerStatus, Prisma } from "@prisma/client";

import { mapQuestionRecordToCardItem } from "@/features/questions/mappers";
import { type CategoryValue, questionFilterDefaults, type DifficultyValue } from "@/features/questions/constants";
import { questionFiltersSchema, type QuestionFiltersInput } from "@/features/questions/schemas";
import type { QuestionDetailResult, QuestionListResult, TagCountItem } from "@/features/questions/types";
import { auth } from "@/features/auth/server/auth";
import { db } from "@/shared/db/client";

export async function getQuestions(input: Partial<QuestionFiltersInput>): Promise<QuestionListResult> {
  const session = await auth();
  const userId = session?.user?.id;
  const filters = questionFiltersSchema.parse({
    page: questionFilterDefaults.page,
    pageSize: questionFilterDefaults.pageSize,
    status: questionFilterDefaults.status,
    ...input,
  });

  const where = buildQuestionWhere(filters, userId);
  const [questions, total] = await Promise.all([
    db.question.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
      include: {
        tags: {
          select: { name: true },
          orderBy: { name: "asc" },
        },
        answers: userId
          ? {
              where: { userId },
              select: { status: true },
              take: 1,
            }
          : false,
        favorites: userId
          ? {
              where: { userId },
              select: { id: true },
              take: 1,
            }
          : false,
      },
    }),
    db.question.count({ where }),
  ]);

  return {
    questions: questions.map(mapQuestionRecordToCardItem),
    total,
    totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
    currentPage: filters.page,
  };
}

export async function getQuestionById(id: string): Promise<QuestionDetailResult | null> {
  const session = await auth();
  const userId = session?.user?.id;

  const question = await db.question.findUnique({
    where: { id },
    include: {
      tags: {
        select: { name: true },
        orderBy: { name: "asc" },
      },
      answers: userId
        ? {
            where: { userId },
            select: { status: true },
            take: 1,
          }
        : false,
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
            take: 1,
          }
        : false,
    },
  });

  if (!question) {
    return null;
  }

  const neighbors = await db.question.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });

  const currentIndex = neighbors.findIndex((item) => item.id === id);
  const prevId = currentIndex > 0 ? neighbors[currentIndex - 1]?.id ?? null : null;
  const nextId = currentIndex >= 0 ? neighbors[currentIndex + 1]?.id ?? null : null;

  return {
    question: {
      id: question.id,
      title: question.title,
      content: question.content,
      answerHint: question.answerHint,
      answer: question.answer,
      deepKnowledge: question.deepKnowledge,
      category: question.category,
      subCategory: question.subCategory,
      difficulty: question.difficulty,
      tags: question.tags.map((tag) => tag.name),
    },
    userAnswer: question.answers?.[0] ? { status: question.answers[0].status } : null,
    isFavorited: Boolean(question.favorites?.length),
    prevId,
    nextId,
  };
}

export async function getAllTags(): Promise<TagCountItem[]> {
  const tags = await db.questionTag.groupBy({
    by: ["name"],
    _count: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return tags.map((tag) => ({
    name: tag.name,
    count: tag._count.name,
  }));
}

export async function getCategoryCounts() {
  const questions = await db.question.groupBy({
    by: ["category"],
    _count: {
      category: true,
    },
  });

  return questions.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.category] = item._count.category;
    return accumulator;
  }, {});
}

function buildQuestionWhere(filters: QuestionFiltersInput, userId?: string): Prisma.QuestionWhereInput {
  const where: Prisma.QuestionWhereInput = {};

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.difficulty) {
    where.difficulty = filters.difficulty;
  }

  if (filters.tag) {
    where.tags = {
      some: {
        name: filters.tag,
      },
    };
  }

  if (filters.search) {
    where.OR = [
      {
        title: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (userId && filters.status !== "all") {
    if (filters.status === "unanswered") {
      where.answers = {
        none: {
          userId,
        },
      };
    } else {
      where.answers = {
        some: {
          userId,
          status: filters.status.toUpperCase() as AnswerStatus,
        },
      };
    }
  }

  return where;
}
