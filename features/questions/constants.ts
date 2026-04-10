import { z } from "zod";

export const CATEGORIES = [
  "HTML_CSS",
  "JAVASCRIPT",
  "BROWSER",
  "NETWORK",
  "FRAMEWORK",
  "ENGINEERING",
  "TYPESCRIPT",
  "NEW_TECH",
] as const;

export const DIFFICULTIES = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
] as const;

export const ANSWER_STATUSES = ["MASTERED", "FUZZY", "UNKNOWN"] as const;
export const QUESTION_FILTER_STATUSES = [
  "all",
  "unanswered",
  "mastered",
  "fuzzy",
  "unknown",
] as const;

export const PAGE_SIZE = 20;

export const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  HTML_CSS: "HTML / CSS",
  JAVASCRIPT: "JavaScript",
  BROWSER: "浏览器",
  NETWORK: "网络",
  FRAMEWORK: "框架",
  ENGINEERING: "工程化",
  TYPESCRIPT: "TypeScript",
  NEW_TECH: "新技术",
};

export const DIFFICULTY_LABELS: Record<(typeof DIFFICULTIES)[number], string> = {
  BEGINNER: "入门",
  INTERMEDIATE: "中级",
  ADVANCED: "高级",
  EXPERT: "专家",
};

export const ANSWER_STATUS_LABELS: Record<(typeof ANSWER_STATUSES)[number], string> = {
  MASTERED: "已掌握",
  FUZZY: "有点模糊",
  UNKNOWN: "不会",
};

export const QUESTION_FILTER_STATUS_LABELS: Record<
  (typeof QUESTION_FILTER_STATUSES)[number],
  string
> = {
  all: "全部",
  unanswered: "未作答",
  mastered: "已掌握",
  fuzzy: "有点模糊",
  unknown: "不会",
};

export const CATEGORY_OPTIONS = CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}));

export const DIFFICULTY_OPTIONS = DIFFICULTIES.map((value) => ({
  value,
  label: DIFFICULTY_LABELS[value],
}));

export const ANSWER_STATUS_OPTIONS = ANSWER_STATUSES.map((value) => ({
  value,
  label: ANSWER_STATUS_LABELS[value],
}));

export const questionFilterDefaults = {
  page: 1,
  pageSize: PAGE_SIZE,
  status: "all",
} as const;

export type CategoryValue = (typeof CATEGORIES)[number];
export type DifficultyValue = (typeof DIFFICULTIES)[number];
export type AnswerStatusValue = (typeof ANSWER_STATUSES)[number];
export type QuestionFilterStatusValue = (typeof QUESTION_FILTER_STATUSES)[number];

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(questionFilterDefaults.page),
  pageSize: z.coerce.number().int().min(1).max(100).default(questionFilterDefaults.pageSize),
});
