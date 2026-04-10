"use server";

import { requireUserId } from "@/features/auth/server/auth";
import { paginationSchema } from "@/features/questions/constants";
import { mapQuestionRecordToCardItem } from "@/features/questions/mappers";
import type { QuestionListQueryInput, QuestionListResult } from "@/features/questions/types";
import { db } from "@/shared/db/client";

export async function getFavorites(input?: QuestionListQueryInput): Promise<QuestionListResult> {
  const userId = await requireUserId();

  const { page, pageSize } = paginationSchema.parse(input ?? {});

  const [favorites, total] = await Promise.all([
    db.userFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        question: {
          include: {
            tags: {
              select: { name: true },
              orderBy: { name: "asc" },
            },
            answers: {
              where: { userId },
              select: { status: true },
              take: 1,
            },
            favorites: {
              where: { userId },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    }),
    db.userFavorite.count({ where: { userId } }),
  ]);

  return {
    questions: favorites.map((item) => mapQuestionRecordToCardItem(item.question)),
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    currentPage: page,
  };
}
