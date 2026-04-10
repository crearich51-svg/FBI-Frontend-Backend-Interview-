import { QuestionFilters } from "@/features/questions/components/QuestionFilters";
import { QuestionList } from "@/features/questions/components/QuestionList";
import { QuestionMobileSidebar } from "@/features/questions/components/QuestionMobileSidebar";
import { QuestionSidebar } from "@/features/questions/components/QuestionSidebar";
import { getCategoryCounts, getQuestions } from "@/features/questions/server/queries";
import { questionFiltersSchema } from "@/features/questions/schemas";
import type { QuestionsPageProps } from "@/features/questions/types";

import { getFirstSearchParamValue } from "@/shared/url";

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const parsed = questionFiltersSchema.parse({
    category: getFirstSearchParamValue(searchParams.category),
    difficulty: getFirstSearchParamValue(searchParams.difficulty),
    status: getFirstSearchParamValue(searchParams.status) ?? "all",
    tag: getFirstSearchParamValue(searchParams.tag),
    search: getFirstSearchParamValue(searchParams.search),
    page: getFirstSearchParamValue(searchParams.page) ?? "1",
    pageSize: getFirstSearchParamValue(searchParams.pageSize) ?? "20",
  });

  const [result, categoryCounts] = await Promise.all([
    getQuestions(parsed),
    getCategoryCounts(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-500">题库</p>
        <h1 className="text-3xl font-semibold text-slate-900">按分类和难度高效刷题</h1>
        <p className="text-sm text-slate-500">结合关键词、分类与掌握状态筛选，快速定位当前最值得练习的题目。</p>
      </div>

      <QuestionFilters
        defaultValues={{
          category: parsed.category,
          difficulty: parsed.difficulty,
          status: parsed.status,
          search: parsed.search,
        }}
      />

      <QuestionMobileSidebar categoryCounts={categoryCounts} currentCategory={parsed.category} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <QuestionSidebar categoryCounts={categoryCounts} currentCategory={parsed.category} />
        <div className="min-w-0 flex-1">
          <QuestionList result={result} />
        </div>
      </div>
    </div>
  );
}
