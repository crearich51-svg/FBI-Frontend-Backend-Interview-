import Link from "next/link";

import { CATEGORY_OPTIONS } from "@/features/questions/constants";
import type { QuestionSidebarProps } from "@/features/questions/types";

export function QuestionSidebar({ categoryCounts, currentCategory }: QuestionSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">分类</h2>
        {currentCategory ? (
          <Link className="text-xs font-medium text-slate-500 hover:text-slate-900" href="/questions">
            清空
          </Link>
        ) : null}
      </div>
      <div className="mt-4 space-y-2">
        {CATEGORY_OPTIONS.map((category) => {
          const isActive = currentCategory === category.value;
          return (
            <Link
              key={category.value}
              href={`/questions?category=${category.value}`}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                isActive ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{category.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive ? "bg-white/10 text-white" : "bg-white text-slate-500"
                }`}
              >
                {categoryCounts[category.value] ?? 0}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
