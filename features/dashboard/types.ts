import type { AnswerStatusValue } from "@/features/questions/constants";

export type UserStatsResult = {
  total: number;
  mastered: number;
  fuzzy: number;
  unknown: number;
  unanswered: number;
  categoryProgress: Array<{
    category: string;
    total: number;
    mastered: number;
  }>;
  recentAnswers: Array<{
    question: {
      id: string;
      title: string;
    };
    status: AnswerStatusValue;
    updatedAt: Date;
  }>;
};

export type StatsCardProps = {
  label: string;
  value: number;
  description?: string;
};

export type CategoryProgressListProps = {
  items: Array<{
    category: string;
    total: number;
    mastered: number;
  }>;
};

export type RecentAnswersListProps = {
  items: UserStatsResult["recentAnswers"];
};
