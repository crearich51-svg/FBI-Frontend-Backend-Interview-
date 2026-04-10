import Link from "next/link";

import type { QuestionNavProps } from "@/features/questions/types";

export function QuestionNav({ prevId, nextId }: QuestionNavProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {prevId ? (
        <Link
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 sm:w-auto"
          href={`/questions/${prevId}`}
        >
          上一题
        </Link>
      ) : (
        <span className="inline-flex w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-100 px-4 py-2 text-sm text-slate-400 sm:w-auto">
          上一题
        </span>
      )}

      {nextId ? (
        <Link
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 sm:w-auto"
          href={`/questions/${nextId}`}
        >
          下一题
        </Link>
      ) : (
        <span className="inline-flex w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-100 px-4 py-2 text-sm text-slate-400 sm:w-auto">
          下一题
        </span>
      )}
    </div>
  );
}
