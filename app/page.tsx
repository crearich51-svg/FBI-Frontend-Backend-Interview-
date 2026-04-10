import Link from "next/link";
import { redirect } from "next/navigation";

import { Footer } from "@/features/landing/components/Footer";
import { auth } from "@/features/auth/server/auth";

import type { HighlightCardProps } from "@/shared/types";

const features = [
  {
    title: "结构化题库",
    description: "覆盖分类、难度、关键词与状态筛选，帮助你快速定位高频考点。",
  },
  {
    title: "渐进式答案",
    description: "先看提示，再看参考答案和深入知识点，训练独立思考能力。",
  },
  {
    title: "进度可视化",
    description: "通过收藏、自评、Dashboard 统计持续追踪自己的学习进度。",
  },
];

export default async function HomePage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                Frontend Interview MVP
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  用题库、答案拆解与进度追踪，系统化通关前端面试
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  从登录开始，到筛选题库、查看题目详情、完成自评和收藏复习，一站式完成你的前端面试刷题闭环。
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white" href="/login">
                  立即开始刷题
                </Link>
                <Link className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700" href="/register">
                  注册账号
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <HighlightCard label="150+" text="一期种子题库，覆盖核心前端知识分类。" />
                <HighlightCard label="3 层" text="提示、答案、深入知识点逐步展开。" />
                <HighlightCard label="URL" text="筛选条件可分享、可刷新恢复。" />
                <HighlightCard label="Dashboard" text="分类进度与最近答题记录实时可见。" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium text-slate-500">Why this product</p>
            <h2 className="text-3xl font-semibold text-slate-900">围绕刷题主链路设计的一期能力</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function HighlightCard({ label, text }: HighlightCardProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-2xl font-semibold text-slate-900">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
