# 快速开始：前端面试通关平台一期 MVP

## 1. 环境准备

1. 使用 `pnpm` 作为包管理工具
2. 准备 Node.js 18+ 运行环境
3. 准备 Neon PostgreSQL 数据库实例
4. 准备 GitHub OAuth 应用，并确保本地、测试、生产环境均完成配置

## 2. 初始化项目

1. 创建 Next.js 14 + TypeScript 项目
2. 安装 TailwindCSS、Shadcn/ui、Radix UI、Prisma、NextAuth、Zustand、react-markdown 等依赖
3. 创建与规格一致的目录结构：`app/`、`server/`、`components/`、`lib/`、`prisma/` 等

## 3. 配置环境变量

在 `.env.local` 中至少配置：

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"
```

## 4. 落库与种子数据

1. 编写 `prisma/schema.prisma`
2. 执行数据库迁移或 `prisma db push`
3. 编写 `prisma/seed.ts`
4. 执行种子脚本导入 150 道题目

## 5. 实现顺序建议

1. 实现 `server/auth.ts` 与 NextAuth 路由
2. 完成注册页、登录页与路由守卫
3. 完成主布局、Navbar、Sidebar、MobileSidebar
4. 完成题库列表、筛选、分页
5. 完成题目详情、MarkdownRenderer、AnswerAccordion、QuestionNav
6. 完成 `upsertAnswer` 与 SelfAssessment
7. 完成 FavoriteButton 与收藏页
8. 完成 Dashboard 统计页
9. 完成 Landing Page
10. 做响应式与回归测试

## 6. 最小验证清单

- 未登录访问 `/questions` 会跳转 `/login`
- 用户可以完成注册、登录、登出与 GitHub OAuth 登录
- 题库支持分类、难度、状态、关键词筛选，且 URL 可恢复
- 题目详情支持三层答案展开与自评状态持久化
- 收藏/取消收藏后收藏页结果正确
- Dashboard 展示统计卡片、分类进度和最近答题记录
- 移动端侧边栏以抽屉形式展示

## 7. 部署前检查

- 所有环境的 GitHub OAuth 回调地址已配置
- 数据库连接字符串与 `NEXTAUTH_SECRET` 已按环境区分
- 种子数据与生产数据初始化方案已确认
- Vercel 环境变量与构建命令配置完成