"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/features/auth/server/auth";
import { type AnswerStatusValue } from "@/features/questions/constants";
import { answerStatusSchema } from "@/features/questions/schemas";
import { db } from "@/shared/db/client";

export async function upsertAnswer(questionId: string, status: AnswerStatusValue) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("未登录");
  }

  const parsedStatus = answerStatusSchema.parse(status);

  const answer = await db.userAnswer.upsert({
    where: {
      userId_questionId: {
        userId: session.user.id,
        questionId,
      },
    },
    update: {
      status: parsedStatus,
    },
    create: {
      userId: session.user.id,
      questionId,
      status: parsedStatus,
    },
  });

  revalidatePath(`/questions/${questionId}`);
  revalidatePath("/questions");
  revalidatePath("/dashboard");

  return answer;
}
