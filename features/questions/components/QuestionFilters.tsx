"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
  QUESTION_FILTER_STATUS_LABELS,
  QUESTION_FILTER_STATUSES,
} from "@/features/questions/constants";
import { SearchInput } from "@/shared/ui/SearchInput";
import type { QuestionFiltersProps } from "@/features/questions/types";

export function QuestionFilters({ defaultValues }: QuestionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SearchInput defaultValue={defaultValues.search} />
        <select
          className="field"
          defaultValue={defaultValues.category ?? ""}
          onChange={(event) => updateParam("category", event.target.value || undefined)}
        >
          <option value="">全部分类</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="field"
          defaultValue={defaultValues.difficulty ?? ""}
          onChange={(event) => updateParam("difficulty", event.target.value || undefined)}
        >
          <option value="">全部难度</option>
          {DIFFICULTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select className="field" defaultValue={defaultValues.status} onChange={(event) => updateParam("status", event.target.value)}>
          {QUESTION_FILTER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {QUESTION_FILTER_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
