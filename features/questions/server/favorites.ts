"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/features/auth/server/auth";
import { db } from "@/shared/db/client";

export async function addFavorite(questionId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("未登录");
  }

  await db.userFavorite.upsert({
    where: {
      userId_questionId: {
        userId: session.user.id,
        questionId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      questionId,
    },
  });

  revalidatePath("/questions");
  revalidatePath(`/questions/${questionId}`);
  revalidatePath("/favorites");
}

export async function removeFavorite(questionId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("未登录");
  }

  await db.userFavorite.deleteMany({
    where: {
      userId: session.user.id,
      questionId,
    },
  });

  revalidatePath("/questions");
  revalidatePath(`/questions/${questionId}`);
  revalidatePath("/favorites");
}
