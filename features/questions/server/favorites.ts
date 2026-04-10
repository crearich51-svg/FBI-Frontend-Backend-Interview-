"use server";

import { revalidatePath } from "next/cache";

import { requireUserId } from "@/features/auth/server/auth";
import { db } from "@/shared/db/client";

export async function addFavorite(questionId: string) {
  const userId = await requireUserId();

  await db.userFavorite.upsert({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
    update: {},
    create: {
      userId,
      questionId,
    },
  });

  revalidatePath("/questions");
  revalidatePath(`/questions/${questionId}`);
  revalidatePath("/favorites");
}

export async function removeFavorite(questionId: string) {
  const userId = await requireUserId();

  await db.userFavorite.deleteMany({
    where: {
      userId,
      questionId,
    },
  });

  revalidatePath("/questions");
  revalidatePath(`/questions/${questionId}`);
  revalidatePath("/favorites");
}
