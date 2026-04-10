import { notFound } from "next/navigation";

import { AnswerAccordion } from "@/features/questions/components/AnswerAccordion";
import { FavoriteButton } from "@/features/questions/components/FavoriteButton";
import { QuestionNav } from "@/features/questions/components/QuestionNav";
import { SelfAssessment } from "@/features/questions/components/SelfAssessment";
import { DifficultyBadge } from "@/features/questions/components/DifficultyBadge";
import { CATEGORY_LABELS } from "@/features/questions/constants";
import { getQuestionById } from "@/features/questions/server/queries";
import { MarkdownRenderer } from "@/shared/ui/MarkdownRenderer";
import type { QuestionDetailPageProps } from "@/features/questions/types";

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const result = await getQuestionById(params.id);

  if (!result) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <QuestionNav nextId={result.nextId} prevId={result.prevId} />

      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {CATEGORY_LABELS[result.question.category]}
          </span>
          <DifficultyBadge difficulty={result.question.difficulty} />
          <span className="text-sm text-slate-500">{result.question.subCategory}</span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{result.question.title}</h1>
            <FavoriteButton initialFavorited={result.isFavorited} questionId={result.question.id} />
          </div>
          <div className="flex flex-wrap gap-2">
            {result.question.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
          <MarkdownRenderer content={result.question.content} />
        </div>
      </article>

      <SelfAssessment initialStatus={result.userAnswer?.status ?? null} questionId={result.question.id} />
      <AnswerAccordion
        answer={result.question.answer}
        answerHint={result.question.answerHint}
        deepKnowledge={result.question.deepKnowledge}
      />
    </div>
  );
}
