import { getFavorites } from "@/features/favorites/server/queries";
import type { FavoritesPageProps } from "@/features/favorites/types";
import { QuestionList } from "@/features/questions/components/QuestionList";
import { getFirstSearchParamValue } from "@/shared/url";

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const page = Number(getFirstSearchParamValue(searchParams.page) ?? "1");
  const pageSize = Number(getFirstSearchParamValue(searchParams.pageSize) ?? "20");
  const result = await getFavorites({ page, pageSize });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-500">收藏</p>
        <h1 className="text-3xl font-semibold text-slate-900">你的重点复习清单</h1>
        <p className="text-sm text-slate-500">把想反复复习的题目集中起来，统一安排回顾节奏。</p>
      </div>
      <QuestionList
        emptyDescription="你还没有收藏题目，先去题库挑几道重点题加入复习清单吧。"
        emptyTitle="收藏列表还是空的"
        result={result}
      />
    </div>
  );
}
