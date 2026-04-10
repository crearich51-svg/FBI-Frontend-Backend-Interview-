import { z } from "zod";

import {
  ANSWER_STATUSES,
  CATEGORIES,
  DIFFICULTIES,
  QUESTION_FILTER_STATUSES,
  paginationSchema,
} from "@/features/questions/constants";

export const questionFiltersSchema = paginationSchema.extend({
  category: z.enum(CATEGORIES).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  status: z.enum(QUESTION_FILTER_STATUSES).default("all"),
  tag: z.string().trim().min(1).optional(),
  search: z.string().trim().max(100).optional(),
});

export const answerStatusSchema = z.enum(ANSWER_STATUSES);

export type QuestionFiltersInput = z.infer<typeof questionFiltersSchema>;
export type AnswerStatusInput = z.infer<typeof answerStatusSchema>;
