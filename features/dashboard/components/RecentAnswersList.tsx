import Link from "next/link";

import { ANSWER_STATUS_LABELS } from "@/features/questions/constants";
import type { RecentAnswersListProps } from "@/features/dashboard/types";
import { EmptyState } from "@/shared/ui/EmptyState";

export function RecentAnswersList({ items }: RecentAnswersListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">最近答题</h2>
        <p className="mt-1 text-sm text-slate-500">最近 10 条自评记录，方便快速回顾。</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          className="border-slate-200 bg-slate-50 p-5 shadow-none"
          description="还没有答题记录，先去题库完成第一道题的自评。"
          title="还没有学习轨迹"
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.question.id}-${item.updatedAt.toISOString()}`} className="flex flex-col gap-3 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link className="block truncate font-medium text-slate-900" href={`/questions/${item.question.id}`}>
                  {item.question.title}
                </Link>
                <p className="mt-1 text-xs text-slate-500">{new Date(item.updatedAt).toLocaleString("zh-CN")}</p>
              </div>
              <span className="inline-flex w-fit shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {ANSWER_STATUS_LABELS[item.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
