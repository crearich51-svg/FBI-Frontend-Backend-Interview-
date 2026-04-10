import type { AnswerStatus } from "@prisma/client";

import type { RouteSearchParams } from "@/shared/types";
import type { AnswerStatusValue, CategoryValue, DifficultyValue } from "@/features/questions/constants";

export type QuestionCardItem = {
  id: string;
  title: string;
  contentPreview: string;
  category: CategoryValue;
  difficulty: DifficultyValue;
  tags: string[];
  userStatus: AnswerStatus | null;
  isFavorited: boolean;
};

export type QuestionListResult = {
  questions: QuestionCardItem[];
  total: number;
  totalPages: number;
  currentPage: number;
};

export type QuestionDetailResult = {
  question: {
    id: string;
    title: string;
    content: string;
    answerHint: string | null;
    answer: string;
    deepKnowledge: string | null;
    category: CategoryValue;
    subCategory: string;
    difficulty: DifficultyValue;
    tags: string[];
  };
  userAnswer: {
    status: AnswerStatus;
  } | null;
  isFavorited: boolean;
  prevId: string | null;
  nextId: string | null;
};

export type TagCountItem = {
  name: string;
  count: number;
};

export type QuestionListQueryInput = {
  page?: number;
  pageSize?: number;
};

export type QuestionRecord = {
  id: string;
  title: string;
  content: string;
  category: CategoryValue;
  difficulty: DifficultyValue;
  tags: Array<{ name: string }>;
  answers?: Array<{ status: AnswerStatus }> | false;
  favorites?: Array<{ id: string }> | false;
};

export type QuestionFiltersDefaultValues = {
  category?: string;
  difficulty?: string;
  status: string;
  search?: string;
};

export type FavoriteButtonProps = {
  questionId: string;
  initialFavorited: boolean;
};

export type SelfAssessmentProps = {
  questionId: string;
  initialStatus: AnswerStatusValue | null;
};

export type AnswerAccordionProps = {
  answerHint?: string | null;
  answer: string;
  deepKnowledge?: string | null;
};

export type QuestionNavProps = {
  prevId: string | null;
  nextId: string | null;
};

export type DifficultyBadgeProps = {
  difficulty: DifficultyValue;
};

export type QuestionFiltersProps = {
  defaultValues: QuestionFiltersDefaultValues;
};

export type QuestionCardProps = {
  question: QuestionCardItem;
};

export type QuestionListProps = {
  result: QuestionListResult;
  emptyTitle?: string;
  emptyDescription?: string;
};

export type QuestionSidebarProps = {
  categoryCounts: Record<string, number>;
  currentCategory?: string;
};

export type QuestionsPageProps = {
  searchParams: RouteSearchParams;
};

export type QuestionDetailPageProps = {
  params: {
    id: string;
  };
};
