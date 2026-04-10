import Link from "next/link";

import { CategoryProgressList } from "@/features/dashboard/components/CategoryProgressList";
import { RecentAnswersList } from "@/features/dashboard/components/RecentAnswersList";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { getUserStats } from "@/features/dashboard/server/queries";
import { auth } from "@/features/auth/server/auth";

export default async function DashboardPage() {
  const [session, stats] = await Promise.all([auth(), getUserStats()]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-slate-500">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {session?.user?.name ? `欢迎回来，${session.user.name}` : "欢迎回来"}
        </h1>
        <p className="mt-3 text-sm text-slate-500">查看当前掌握进度、分类完成度和最近刷题轨迹。</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard description="题库总题数" label="总题量" value={stats.total} />
        <StatsCard description="已经掌握的题目" label="已掌握" value={stats.mastered} />
        <StatsCard description="还需要巩固的题目" label="有点模糊" value={stats.fuzzy} />
        <StatsCard description="当前不会的题目" label="不会" value={stats.unknown} />
        <StatsCard description="尚未自评的题目" label="未作答" value={stats.unanswered} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CategoryProgressList items={stats.categoryProgress} />
        <RecentAnswersList items={stats.recentAnswers} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">想继续刷题？</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white" href="/questions">
            去题库
          </Link>
          <Link className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700" href="/favorites">
            查看收藏
          </Link>
        </div>
      </div>
    </div>
  );
}
