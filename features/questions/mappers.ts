import type { QuestionCardItem, QuestionRecord } from "@/features/questions/types";

export function createQuestionPreview(content: string) {
  return content.replace(/[#*_`>-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}

export function mapQuestionRecordToCardItem(question: QuestionRecord): QuestionCardItem {
  const answers = Array.isArray(question.answers) ? question.answers : [];
  const favorites = Array.isArray(question.favorites) ? question.favorites : [];

  return {
    id: question.id,
    title: question.title,
    contentPreview: createQuestionPreview(question.content),
    category: question.category,
    difficulty: question.difficulty,
    tags: question.tags.map((tag) => tag.name),
    userStatus: answers[0]?.status ?? null,
    isFavorited: favorites.length > 0,
  };
}
