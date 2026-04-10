import { DIFFICULTY_LABELS } from "@/features/questions/constants";
import type { DifficultyBadgeProps } from "@/features/questions/types";

const difficultyClassName: Record<DifficultyBadgeProps["difficulty"], string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700",
  INTERMEDIATE: "bg-sky-100 text-sky-700",
  ADVANCED: "bg-amber-100 text-amber-700",
  EXPERT: "bg-rose-100 text-rose-700",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${difficultyClassName[difficulty]}`}>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}
