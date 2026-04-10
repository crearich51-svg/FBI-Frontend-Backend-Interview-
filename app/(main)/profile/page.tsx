import Link from "next/link";

import { RecentAnswersList } from "@/features/dashboard/components/RecentAnswersList";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { getUserStats } from "@/features/dashboard/server/queries";
import { auth } from "@/features/auth/server/auth";

export default async function ProfilePage() {
  const [session, stats] = await Promise.all([auth(), getUserStats()]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-slate-500">个人中心</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {session?.user?.name ?? session?.user?.email ?? "当前用户"}
        </h1>
        <p className="mt-3 text-sm text-slate-500">这里汇总你的刷题表现，并提供进入 Dashboard 的快捷入口。</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="已掌握" value={stats.mastered} />
        <StatsCard label="有点模糊" value={stats.fuzzy} />
        <StatsCard label="不会" value={stats.unknown} />
      </section>

      <RecentAnswersList items={stats.recentAnswers} />

      <Link className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white" href="/dashboard">
        返回 Dashboard
      </Link>
    </div>
  );
}
