# Tasks: 前端面试通关平台一期 MVP

**Input**: 设计文档来自 `/specs/20260409-frontend-interview-platform/`
**Prerequisites**: plan.md、spec.md、research.md、data-model.md、contracts/、quickstart.md

**Tests**: 本次任务拆分不单独生成测试先行任务；在实现阶段按 quickstart 的最小验证清单与关键路径回归执行。

**Organization**: 任务按用户故事组织，确保每个故事可独立实现、独立验证、独立演示。

## Format: `[ID] [P?] [Story] Description`
- **[P]**: 可并行执行（不同文件、无直接依赖）
- **[Story]**: 对应用户故事（US1、US2...）
- 描述中包含精确文件路径，任务可直接执行

## Path Conventions
- 应用采用单仓 Next.js Web 结构
- 主要目录：`app/`、`server/`、`components/`、`lib/`、`prisma/`
- 规划文档位于：`specs/20260409-frontend-interview-platform/`

## Phase 1: Setup（共享初始化）

**Purpose**: 初始化项目骨架与基础开发环境

- [x] T001 [Setup] 在仓库根目录创建 `app/`、`server/`、`components/`、`lib/`、`prisma/`、`public/` 等目录，并建立与 `plan.md` 一致的初始文件结构。
- [x] T002 [Setup] 初始化 `package.json`、Next.js 14 + TypeScript 基础配置，以及 `tsconfig.json`、`next.config.ts`、`postcss`/Tailwind 所需工程配置。
- [x] T003 [P] [Setup] 安装并配置核心依赖：NextAuth、Prisma、PostgreSQL 驱动、Shadcn/ui、Radix UI、Zustand、react-markdown 相关包。
- [x] T004 [P] [Setup] 创建 `.env.example` 与环境变量说明，覆盖 `DATABASE_URL`、`DIRECT_URL`、`NEXTAUTH_URL`、`NEXTAUTH_SECRET`、`GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`。

---

## Phase 2: Foundational（阻塞性前置能力）

**Purpose**: 所有用户故事开始前必须完成的基础设施

**⚠️ CRITICAL**: 本阶段完成前，不进入任何用户故事开发

- [x] T005 [Foundation] 在 `prisma/schema.prisma` 中实现 `User`、`Account`、`Session`、`VerificationToken`、`Question`、`QuestionTag`、`UserAnswer`、`UserFavorite` 与相关枚举、索引、唯一约束。
- [x] T006 [P] [Foundation] 在 `server/db.ts` 中创建 Prisma Client 单例，并约定服务端访问数据库的统一入口。
- [x] T007 [P] [Foundation] 在 `lib/constants.ts` 与 `lib/validations.ts` 中定义分类/难度/状态枚举映射、注册登录表单校验与题库筛选参数校验。
- [x] T008 [Foundation] 在 `server/auth.ts` 与 `app/api/auth/[...nextauth]/route.ts` 中建立 NextAuth 基础配置、Prisma Adapter、JWT Session 与 GitHub Provider 骨架。
- [x] T009 [Foundation] 在 `app/layout.tsx` 中接入全局字体、基础 metadata、SessionProvider、Toaster 容器与全局样式入口 `app/globals.css`。
- [x] T010 [P] [Foundation] 在 `components/shared/` 下创建 `LoadingSpinner.tsx`、`EmptyState.tsx`、`Pagination.tsx`、`SearchInput.tsx` 等跨故事共享组件骨架。
- [x] T011 [Foundation] 在 `prisma/seed.ts` 中建立 150 道题目的种子数据导入框架与分类配额结构，确保后续题库与统计能力有稳定数据源。

**Checkpoint**: Foundation 完成后，可按优先级推进各用户故事

---

## Phase 3: User Story 1 - 用户完成注册、登录并进入受保护题库 (Priority: P1) 🎯 MVP

**Goal**: 交付邮箱密码注册登录、GitHub OAuth 登录、路由守卫与登出完整闭环。

**Independent Test**: 新用户可注册并自动进入 `/dashboard`；已存在用户可登录；未登录访问 `(main)` 页面会跳转 `/login`；已登录用户可登出返回首页。

### Implementation for User Story 1

- [x] T012 [US1] 在 `app/(auth)/layout.tsx` 中实现鉴权页居中卡片布局，承载登录与注册页面。
- [x] T013 [P] [US1] 在 `components/auth/RegisterForm.tsx` 中实现注册表单、字段校验、loading 态、错误展示与去登录链接。
- [x] T014 [P] [US1] 在 `components/auth/LoginForm.tsx` 与 `components/auth/OAuthButtons.tsx` 中实现邮箱密码登录与 GitHub 登录按钮组。
- [x] T015 [US1] 在 `server/actions/auth.ts`（如需新增）或 `server/auth.ts` 配套逻辑中实现 `registerUser(formData)`、密码哈希、自动登录与登录失败错误处理。
- [x] T016 [US1] 在 `app/(auth)/register/page.tsx` 与 `app/(auth)/login/page.tsx` 中接入表单组件，完成页面跳转关系。
- [x] T017 [US1] 在 `app/(main)/layout.tsx`、`components/layout/Navbar.tsx` 中实现路由守卫、用户菜单、登出入口与已登录访问 `/login` 的重定向逻辑。

**Checkpoint**: User Story 1 可独立演示，构成一期 MVP 最小可用版本

---

## Phase 4: User Story 2 - 用户按分类、难度、状态与关键词浏览题库 (Priority: P1)

**Goal**: 交付题库列表、分类侧边栏、URL 驱动筛选与分页浏览能力。

**Independent Test**: 用户登录后可通过分类、难度、状态、关键词和分页组合筛选题目，并在刷新或分享 URL 后恢复相同结果。

### Implementation for User Story 2

- [x] T018 [US2] 在 `server/actions/questions.ts` 中实现 `getQuestions`、`getAllTags`、`getCategoryCounts`，包含 Prisma where 拼装、状态过滤与分页逻辑。
- [x] T019 [P] [US2] 在 `components/questions/QuestionCard.tsx` 与 `components/questions/DifficultyBadge.tsx` 中实现题目卡片、难度标签、状态/收藏标记显示。
- [x] T020 [P] [US2] 在 `components/questions/QuestionFilters.tsx` 中实现分类、难度、状态、搜索筛选控件，并通过 `useRouter().push()` 更新 URL search params。
- [x] T021 [P] [US2] 在 `components/layout/Sidebar.tsx` 与 `components/layout/MobileSidebar.tsx` 中实现分类树、题目数量 badge、当前分类高亮与移动端抽屉导航。
- [x] T022 [US2] 在 `components/questions/QuestionList.tsx` 中组装列表容器，接入空状态、分页和加载态。
- [x] T023 [US2] 在 `app/(main)/questions/page.tsx` 中完成 Server Component 查询、筛选参数解析与题库页面装配。

**Checkpoint**: User Story 2 可独立验证，用户已具备完整题库浏览能力

---

## Phase 5: User Story 3 - 用户查看题目详情、渐进式答案并完成自评 (Priority: P1)

**Goal**: 交付题目详情页、Markdown 渲染、三层答案展开、自评与上一题/下一题导航。

**Independent Test**: 用户可从列表进入单题详情，正确查看 Markdown 内容、展开答案层级、更新自评状态并在刷新后保留，同时可在当前筛选上下文中切换上一题/下一题。

### Implementation for User Story 3

- [x] T024 [US3] 在 `server/actions/questions.ts` 中实现 `getQuestionById`，返回题目详情、用户答题状态、收藏状态与前后题 ID。
- [x] T025 [P] [US3] 在 `components/shared/MarkdownRenderer.tsx` 中实现 Markdown、GFM、代码高亮与行内代码样式渲染。
- [x] T026 [P] [US3] 在 `components/questions/AnswerAccordion.tsx` 中实现三层答案折叠/展开逻辑，空内容自动隐藏。
- [x] T027 [P] [US3] 在 `components/questions/SelfAssessment.tsx` 中实现客户端自评按钮、乐观更新与状态高亮。
- [x] T028 [P] [US3] 在 `components/questions/QuestionNav.tsx` 中实现上一题/下一题跳转及禁用态。
- [x] T029 [US3] 在 `server/actions/answers.ts` 中实现 `upsertAnswer` 与 `getUserStats` 基础能力中的自评写入部分，并处理 `revalidatePath`。
- [x] T030 [US3] 在 `app/(main)/questions/[id]/page.tsx` 中集成题目详情、自评、答案区、导航与收藏入口。

**Checkpoint**: User Story 3 完成后，平台核心刷题闭环成立

---

## Phase 6: User Story 4 - 用户收藏题目并在收藏列表统一复习 (Priority: P2)

**Goal**: 交付题目收藏/取消收藏与收藏列表页，支撑重点题集中复习。

**Independent Test**: 用户可在卡片或详情页收藏题目，收藏页能展示结果；取消收藏后状态与列表同步变化。

### Implementation for User Story 4

- [x] T031 [US4] 在 `server/actions/favorites.ts` 中实现 `addFavorite`、`removeFavorite`、`getFavorites`。
- [x] T032 [P] [US4] 在 `components/questions/FavoriteButton.tsx`（如需新增）中实现收藏按钮、乐观更新与状态切换。
- [x] T033 [US4] 在 `components/questions/QuestionCard.tsx` 与 `app/(main)/questions/[id]/page.tsx` 中接入收藏按钮显示与交互。
- [x] T034 [US4] 在 `app/(main)/favorites/page.tsx` 中实现收藏列表页，复用 `QuestionList` / `QuestionCard`，处理空状态与分页。

**Checkpoint**: User Story 4 完成后，用户可形成个人复习清单

---

## Phase 7: User Story 5 - 用户查看 Dashboard 统计与分类学习进度 (Priority: P2)

**Goal**: 交付 Dashboard 统计卡片、分类进度和最近答题记录，形成进度追踪能力。

**Independent Test**: 用户完成若干题目自评后，Dashboard 能准确展示总量、状态分布、分类进度和最近 10 条答题记录。

### Implementation for User Story 5

- [x] T035 [US5] 在 `server/actions/answers.ts` 中补全 `getUserStats`，实现 `groupBy`、`$queryRaw` 分类进度与最近答题查询。
- [x] T036 [P] [US5] 在 `components/layout/Navbar.tsx` 中补齐“题库 / 收藏 / 统计”导航与 active 态高亮。
- [x] T037 [P] [US5] 在 `components/` 下新增或实现 Dashboard 所需统计卡片、分类进度列表与最近答题展示子组件。
- [x] T038 [US5] 在 `app/(main)/dashboard/page.tsx` 中集成欢迎语、统计卡片、分类进度与最近答题记录。
- [x] T039 [US5] 在 `app/(main)/profile/page.tsx` 中实现用户中心/刷题统计页占位或与 Dashboard 保持一致的导航落点。

**Checkpoint**: User Story 5 完成后，用户能看到完整学习反馈

---

## Phase 8: User Story 6 - 访客访问 Landing Page 并被引导开始刷题 (Priority: P3)

**Goal**: 交付未登录首页、产品介绍与 CTA 跳转逻辑。

**Independent Test**: 未登录访问 `/` 时能看到 Hero 与产品卖点，点击 CTA 跳转 `/login`；已登录访问 `/` 时直接进入 `/dashboard`。

### Implementation for User Story 6

- [x] T040 [US6] 在 `app/page.tsx` 中实现未登录 Landing Page 与已登录重定向逻辑。
- [x] T041 [P] [US6] 在 `components/layout/Footer.tsx` 与 Landing Page 相关展示模块中实现 Hero、Features、CTA 等静态内容区块。
- [x] T042 [US6] 在 `app/layout.tsx`、`components/layout/Navbar.tsx` 中调整访客态与登录态首页入口展示差异。

**Checkpoint**: User Story 6 完成后，对外入口与转化路径完整

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: 完成跨故事整合、响应式收尾与上线前验证

- [x] T043 [Polish] 检查并统一 `app/`、`components/`、`server/` 下所有页面与组件的样式、空状态、loading 态与错误提示文案。
- [x] T044 [P] [Polish] 完成移动端适配，重点校验 Sidebar 抽屉、题目卡片单列、详情页交互与导航布局。
- [x] T045 [P] [Polish] 依据 `quickstart.md` 执行最小验证清单，修正注册登录、筛选、自评、收藏、Dashboard 与 Landing Page 的集成问题。
- [x] T046 [Polish] 完善 `README.md` 或项目启动说明，补充环境变量、种子数据和部署步骤。
- [x] T047 [Polish] 完成 Vercel 部署前检查：环境变量、GitHub OAuth 回调地址、数据库连接与构建设置。

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**：可立即开始
- **Phase 2 Foundational**：依赖 Setup 完成，且阻塞全部用户故事
- **Phase 3-8 User Stories**：均依赖 Foundational 完成；建议按 P1 → P2 → P3 顺序推进
- **Phase 9 Polish**：依赖所有目标用户故事完成

### User Story Dependencies

- **US1**：仅依赖 Foundational，是 MVP 最小闭环起点
- **US2**：依赖 Foundational；建议在 US1 后开展，以复用登录态与主布局
- **US3**：依赖 US2 的题库入口和 `getQuestionById` 数据模型
- **US4**：依赖 US2 / US3 的题目展示入口
- **US5**：依赖 US3 的答题记录与 US4 的部分导航整合
- **US6**：仅依赖 Foundational，可与 P2 故事后段并行，但优先级最低

### Within Each User Story

- 服务端数据能力优先于页面装配
- 共享组件先于页面接入
- 同文件任务顺序执行，不标记 [P]
- 不同文件且无依赖冲突的任务使用 [P]

### Parallel Opportunities

- Setup 阶段：T003 与 T004 可并行
- Foundational 阶段：T006、T007、T010 可并行
- US1：T013 与 T014 可并行
- US2：T019、T020、T021 可并行
- US3：T025、T026、T027、T028 可并行
- US5：T036 与 T037 可并行
- Polish：T044 与 T045 可并行

---

## Parallel Example: User Story 2

```bash
Task: "在 components/questions/QuestionCard.tsx 与 components/questions/DifficultyBadge.tsx 中实现题目卡片与难度标签"
Task: "在 components/questions/QuestionFilters.tsx 中实现筛选控件与 URL 参数更新"
Task: "在 components/layout/Sidebar.tsx 与 components/layout/MobileSidebar.tsx 中实现分类侧边栏与移动端抽屉"
```

---

## Implementation Strategy

### MVP First（建议范围）

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational
3. 完成 Phase 3: US1（注册登录与路由守卫）
4. 完成 Phase 4: US2（题库浏览与筛选）
5. 完成 Phase 5: US3（题目详情与自评）
6. 停止并验证刷题主闭环，可作为一期 MVP 演示版本

### Incremental Delivery

1. US1 完成后交付可登录的最小产品壳
2. US2 完成后交付可浏览题库的学习入口
3. US3 完成后交付核心刷题闭环
4. US4 + US5 完成后补齐复习与统计能力
5. US6 与 Polish 完成后进入对外展示与上线准备

### Parallel Team Strategy

- 开发者 A：Foundational / US1
- 开发者 B：US2 / US3 的组件侧工作
- 开发者 C：US4 / US5 / US6 与发布准备
- 前提是 Foundation 完成且共享约定稳定

---

## Notes

- 当前任务总数为 47
- 任务以用户故事为中心拆分，便于逐阶段验收
- 未单独生成测试先行任务，因为规格未要求 TDD；实现阶段仍需按 quickstart 做关键路径验证
- 推荐 MVP 范围：US1 + US2 + US3
