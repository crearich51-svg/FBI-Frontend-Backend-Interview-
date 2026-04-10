"use server";

import { Prisma } from "@prisma/client";

import { requireUserId } from "@/features/auth/server/auth";
import { CATEGORY_LABELS } from "@/features/questions/constants";
import type { UserStatsResult } from "@/features/dashboard/types";
import { db } from "@/shared/db/client";

export async function getUserStats(): Promise<UserStatsResult> {
  const userId = await requireUserId();

  const [total, statusGroups, recentAnswers, categoryProgress] = await Promise.all([
    db.question.count(),
    db.userAnswer.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    db.userAnswer.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 10,
      include: {
        question: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
    db.$queryRaw<Array<{ category: string; total: bigint; mastered: bigint }>>(Prisma.sql`
      SELECT
        q."category" as category,
        COUNT(q."id") as total,
        COUNT(CASE WHEN ua."status" = 'MASTERED' THEN 1 END) as mastered
      FROM "Question" q
      LEFT JOIN "UserAnswer" ua
        ON ua."questionId" = q."id"
        AND ua."userId" = ${userId}
      GROUP BY q."category"
      ORDER BY q."category" ASC
    `),
  ]);

  const mastered = statusGroups.find((item) => item.status === "MASTERED")?._count.status ?? 0;
  const fuzzy = statusGroups.find((item) => item.status === "FUZZY")?._count.status ?? 0;
  const unknown = statusGroups.find((item) => item.status === "UNKNOWN")?._count.status ?? 0;

  return {
    total,
    mastered,
    fuzzy,
    unknown,
    unanswered: Math.max(total - mastered - fuzzy - unknown, 0),
    categoryProgress: categoryProgress.map((item) => ({
      category: CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS],
      total: Number(item.total),
      mastered: Number(item.mastered),
    })),
    recentAnswers: recentAnswers.map((item) => ({
      question: item.question,
      status: item.status,
      updatedAt: item.updatedAt,
    })),
  };
}
