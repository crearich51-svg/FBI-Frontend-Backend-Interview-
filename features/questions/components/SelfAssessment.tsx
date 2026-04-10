"use client";

import { useOptimistic, useTransition } from "react";

import { ANSWER_STATUS_LABELS, type AnswerStatusValue } from "@/features/questions/constants";
import { upsertAnswer } from "@/features/questions/server/answers";
import type { SelfAssessmentProps } from "@/features/questions/types";

const statuses: AnswerStatusValue[] = ["MASTERED", "FUZZY", "UNKNOWN"];

export function SelfAssessment({ questionId, initialStatus }: SelfAssessmentProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(initialStatus);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-900">你的掌握程度</p>
        <p className="text-xs text-slate-500">自评后会同步更新到 Dashboard 统计</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {statuses.map((status) => {
          const active = optimisticStatus === status;
          return (
            <button
              key={status}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  setOptimisticStatus(status);
                  await upsertAnswer(questionId, status);
                });
              }}
              type="button"
            >
              {isPending && active ? "保存中..." : ANSWER_STATUS_LABELS[status]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
