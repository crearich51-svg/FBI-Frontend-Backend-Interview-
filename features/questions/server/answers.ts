"use server";

import { revalidatePath } from "next/cache";

import { requireUserId } from "@/features/auth/server/auth";
import { type AnswerStatusValue } from "@/features/questions/constants";
import { answerStatusSchema } from "@/features/questions/schemas";
import { db } from "@/shared/db/client";

export async function upsertAnswer(questionId: string, status: AnswerStatusValue) {
  const userId = await requireUserId();

  const parsedStatus = answerStatusSchema.parse(status);

  const answer = await db.userAnswer.upsert({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
    update: {
      status: parsedStatus,
    },
    create: {
      userId,
      questionId,
      status: parsedStatus,
    },
  });

  revalidatePath(`/questions/${questionId}`);
  revalidatePath("/questions");
  revalidatePath("/dashboard");

  return answer;
}
