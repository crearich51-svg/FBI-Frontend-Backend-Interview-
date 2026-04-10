"use client";

import Link from "next/link";
import { useState } from "react";

import { CATEGORY_OPTIONS } from "@/features/questions/constants";
import type { QuestionSidebarProps } from "@/features/questions/types";

export function QuestionMobileSidebar({ categoryCounts, currentCategory }: QuestionSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        aria-expanded={open}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? "收起分类筛选" : "展开分类筛选"}
      </button>

      {open ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">按分类浏览</p>
            {currentCategory ? (
              <Link className="text-xs font-medium text-slate-500 hover:text-slate-900" href="/questions" onClick={() => setOpen(false)}>
                清空
              </Link>
            ) : null}
          </div>
          <div className="space-y-2">
            {CATEGORY_OPTIONS.map((category) => {
              const isActive = currentCategory === category.value;
              return (
                <Link
                  key={category.value}
                  href={`/questions?category=${category.value}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                    isActive ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600"
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
        </div>
      ) : null}
    </div>
  );
}
