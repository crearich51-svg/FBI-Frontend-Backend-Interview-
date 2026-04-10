import { EmptyState } from "@/shared/ui/EmptyState";
import type { CategoryProgressListProps } from "@/features/dashboard/types";

export function CategoryProgressList({ items }: CategoryProgressListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">分类进度</h2>
        <p className="mt-1 text-sm text-slate-500">查看每个分类的掌握题数与总题数。</p>
      </div>
      {items.length === 0 ? (
        <EmptyState
          className="border-slate-200 bg-slate-50 p-5 shadow-none"
          description="当前还没有可展示的分类进度，完成几道题的自评后会显示在这里。"
          title="暂无分类进度"
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const percentage = item.total ? Math.round((item.mastered / item.total) * 100) : 0;
            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                  <span className="font-medium text-slate-900">{item.category}</span>
                  <span className="shrink-0">
                    {item.mastered} / {item.total} · {percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-slate-900" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
