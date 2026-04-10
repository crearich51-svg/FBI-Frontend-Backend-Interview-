import { Category, Difficulty, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORY_QUOTAS: Record<Category, number> = {
  HTML_CSS: 18,
  JAVASCRIPT: 28,
  BROWSER: 18,
  NETWORK: 16,
  FRAMEWORK: 26,
  ENGINEERING: 18,
  TYPESCRIPT: 16,
  NEW_TECH: 10,
};

const DIFFICULTY_SEQUENCE: Difficulty[] = [
  Difficulty.BEGINNER,
  Difficulty.INTERMEDIATE,
  Difficulty.ADVANCED,
  Difficulty.EXPERT,
];

function createQuestion(category: Category, index: number, sortOrder: number) {
  const difficulty = DIFFICULTY_SEQUENCE[index % DIFFICULTY_SEQUENCE.length];
  const tags = [category.toLowerCase(), `tag-${(index % 6) + 1}`, "interview"];

  return {
    title: `${category} 面试题 ${index + 1}`,
    content: `## ${category} 面试题 ${index + 1}\n\n请解释该知识点，并说明典型应用场景。`,
    answerHint: `先从 ${category} 基础概念入手，再补充实际场景。`,
    answer: `这是 ${category} 的标准参考答案模板，第 ${index + 1} 题。`,
    deepKnowledge: `可以进一步延展到性能优化、边界情况与工程实践。`,
    category,
    subCategory: `${category} 子类 ${(index % 4) + 1}`,
    difficulty,
    sortOrder,
    tags: {
      create: tags.map((name) => ({ name })),
    },
  };
}

async function main() {
  await prisma.questionTag.deleteMany();
  await prisma.userAnswer.deleteMany();
  await prisma.userFavorite.deleteMany();
  await prisma.question.deleteMany();

  let sortOrder = 1;

  for (const [category, quota] of Object.entries(CATEGORY_QUOTAS) as [Category, number][]) {
    for (let index = 0; index < quota; index += 1) {
      await prisma.question.create({
        data: createQuestion(category, index, sortOrder),
      });
      sortOrder += 1;
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
