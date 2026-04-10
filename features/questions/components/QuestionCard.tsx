import Link from "next/link";

import { ANSWER_STATUS_LABELS, CATEGORY_LABELS } from "@/features/questions/constants";
import { DifficultyBadge } from "@/features/questions/components/DifficultyBadge";
import { FavoriteButton } from "@/features/questions/components/FavoriteButton";
import type { QuestionCardProps } from "@/features/questions/types";

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            {CATEGORY_LABELS[question.category]}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            <Link className="hover:text-slate-700" href={`/questions/${question.id}`}>
              {question.title}
            </Link>
          </h3>
        </div>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">{question.contentPreview || "暂无摘要"}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>{question.userStatus ? ANSWER_STATUS_LABELS[question.userStatus] : "未作答"}</span>
        <FavoriteButton initialFavorited={question.isFavorited} questionId={question.id} />
      </div>
    </article>
  );
}
