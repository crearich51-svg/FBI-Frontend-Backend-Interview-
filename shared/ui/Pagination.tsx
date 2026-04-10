import type { PaginationProps } from "@/shared/types";

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
      <span>第 {currentPage} 页</span>
      <span>共 {totalPages} 页</span>
    </div>
  );
}
