"use client";

import { EmptyState } from "@/shared/ui/EmptyState";
import { Pagination } from "@/shared/ui/Pagination";
import { QuestionCard } from "@/features/questions/components/QuestionCard";
import type { QuestionListProps } from "@/features/questions/types";

export function QuestionList({
  result,
  emptyTitle = "暂无匹配题目",
  emptyDescription = "试试调整分类、难度或关键词筛选条件。",
}: QuestionListProps) {
  if (result.questions.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {result.questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
      <Pagination currentPage={result.currentPage} totalPages={result.totalPages} />
    </div>
  );
}
