# 功能规格说明：前端面试通关平台一期 MVP

**Feature**: `20260409-frontend-interview-platform`
**Created**: 2026-04-09
**Status**: Draft
**Input**: 飞书文档：https://bytedance.larkoffice.com/docx/DJ0nd99Z6omRAxxKEbqc91lKnSb （本地副本：[DJ0nd99Z6omRAxxKEbqc91lKnSb.md](../doc_export/DJ0nd99Z6omRAxxKEbqc91lKnSb/DJ0nd99Z6omRAxxKEbqc91lKnSb.md)）

## 输入评估

**成熟度：Sufficient**（10/10）

| 维度 | 分数 | 说明 |
| --- | --- | --- |
| 目标清晰度 | 2/2 | 已明确“一期 MVP”定位、范围边界与产品目标 |
| 角色识别 | 2/2 | 明确包含未登录访客、注册/登录用户、平台维护者 |
| 功能行为 | 2/2 | 已逐模块给出页面、组件、接口、数据结构与交互 |
| 范围与约束 | 2/2 | 已列出做/不做范围、技术栈、部署方式与环境变量 |
| 验收提示 | 2/2 | 已提供开发步骤、验证标准、分页/筛选/统计等明确结果 |

### 结论

输入信息完整，可直接生成规格说明。文档中的实现细节已转化为本规格的用户故事、需求、实体与附录约束，无需额外澄清。

## 用户场景与测试 *(mandatory)*

### 用户故事 1 - 用户完成注册、登录并进入受保护题库 (Priority: P1)

作为希望系统化准备前端面试的用户，我需要通过邮箱密码或 GitHub OAuth 完成注册/登录，并在登录后访问受保护的主应用页面，以便开始刷题、记录状态和查看个人进度。

**Why this priority**: 没有鉴权与路由保护，就无法区分访客与学习用户，也无法保存答题状态、收藏记录和统计数据，因此这是 MVP 的入口能力。

**Technical Implementation**:

- 一期范围包含：鉴权登录、题库浏览与筛选、题目详情与答案展示、答题自评与进度追踪、基础 UI 框架；不包含 AI 追问、简历解析、手撕代码编辑器、面试通过概率、社区 UGC。
- 技术基线：Next.js 14 App Router、TypeScript 5、Prisma 5、PostgreSQL(Neon)、NextAuth.js v5、Zustand 4、TailwindCSS 4、Shadcn/ui + Radix UI、pnpm 9、Vercel。
- 鉴权相关页面与文件：`app/(auth)/login/page.tsx`、`app/(auth)/register/page.tsx`、`app/(auth)/layout.tsx`、`app/api/auth/[...nextauth]/route.ts`、`server/auth.ts`。
- NextAuth 统一由 `server/auth.ts` 配置，使用 Prisma Adapter；Session 策略为 JWT；Provider 至少包含 CredentialsProvider（邮箱+密码）与 GitHubProvider。
- Session 回调需把 `token.sub` 注入 `session.user.id`，登录页路径固定为 `/login`。
- 注册页组件为 `RegisterForm`，字段与校验规则：
  - `name`: 必填，2-50 字符；
  - `email`: 必填、合法邮箱格式、数据库唯一；
  - `password`: 必填，8-100 字符，至少一个大写字母和一个数字；
  - `confirmPassword`: 必填，且与 `password` 一致。
- 注册 Server Action 为 `registerUser(formData)`，执行顺序为：表单校验 → bcrypt 哈希密码 → 创建用户 → 自动登录 → 跳转 `/dashboard`；若邮箱已存在则返回错误提示。
- 注册页 UI：居中卡片、最大宽度 `max-w-md`、底部“已有账号？去登录”链接、底部 GitHub OAuth 按钮、分割线“或”、提交按钮 loading 态。
- 登录页组件为 `LoginForm`，字段为 `email` 与 `password`；行为为校验后调用 `signIn("credentials")`，成功跳转 `/dashboard`，失败 toast 提示“邮箱或密码错误”；GitHub 登录调用 `signIn("github")`。
- 登录页 UI 与注册页保持同构：居中卡片、去注册链接、GitHub OAuth 按钮。
- `(main)` 组页面必须在 `app/(main)/layout.tsx` 中通过 `const session = await auth(); if (!session) redirect("/login")` 进行保护；`(auth)` 组不受保护；已登录用户访问 `/login` 时需重定向到 `/dashboard`。
- 登出入口位于 Navbar 用户菜单下拉中，行为为 `signOut()` → 清除 Session → 跳转首页 `/`。
- 根布局 `app/layout.tsx` 需负责全局字体、metadata、`SessionProvider`、`ThemeProvider`（可选一期不启用暗黑主题）、`globals.css` 和 `Toaster` 容器。

**Independent Test**: 可通过“新用户注册 → 自动进入 Dashboard → 退出登录 → 使用邮箱密码再次登录 → 使用 GitHub 登录 → 未登录访问 `/questions` 被拦截”完整验证，并独立交付可用的学习账号体系。

**Acceptance Scenarios**:

1. **Given** 未注册用户访问注册页，**When** 填写合法姓名、邮箱、密码并提交，**Then** 系统创建账号、自动登录并跳转到 `/dashboard`。
2. **Given** 用户输入已存在邮箱注册，**When** 提交注册表单，**Then** 系统阻止创建并返回邮箱已存在错误。
3. **Given** 未登录用户直接访问 `(main)` 组任一页面，**When** 页面加载，**Then** 系统将其重定向到 `/login`。
4. **Given** 已登录用户访问 `/login`，**When** 页面加载，**Then** 系统将其重定向到 `/dashboard`。
5. **Given** 用户已登录，**When** 在 Navbar 用户菜单点击登出，**Then** Session 被清除并返回首页 `/`。

---

### 用户故事 2 - 用户按分类、难度、状态与关键词浏览题库 (Priority: P1)

作为登录后的刷题用户，我希望按分类、难度、答题状态、标签与关键词筛选题目，并使用可分享的 URL 保留筛选结果，以便快速定位需要复习或重点突破的题目。

**Why this priority**: 题库浏览和筛选是平台的核心学习入口，直接决定用户能否高效找到题目并建立稳定刷题流程。

**Technical Implementation**:

- 题目列表页位于 `app/(main)/questions/page.tsx`，使用 React Server Component 直接查询数据库。
- 所有筛选条件通过 URL Query 管理并支持分享，参数包括：`category`、`difficulty`、`tag`、`status`、`search`、`page`。
- `status` 允许值为 `all / unanswered / mastered / fuzzy / unknown`，默认 `all`；`page` 默认 1。
- 查询逻辑需按条件拼装 Prisma `where`：
  - `category`、`difficulty` 直接过滤；
  - `tag` 通过 `tags.some.name` 过滤；
  - `search` 同时匹配 `title` 与 `content`，且大小写不敏感；
  - `status=unanswered` 时过滤当前用户在 `UserAnswer` 中无记录的题目；
  - `status=mastered/fuzzy/unknown` 时按当前用户答题状态联表过滤。
- 分页固定为每页 20 条，使用 Prisma `skip + take`。
- 页面展示结构：顶部 `QuestionFilters`，中部 `QuestionList`（由多个 `QuestionCard` 组成），底部 `Pagination`。
- `QuestionCard` 展示难度 badge、一级分类、标签、题目标题、内容摘要（前 80 字）、用户状态与收藏标记；整张卡片可点击并跳转 `/questions/[id]`。
- 用户状态图标约定：未答题为灰色圆圈，已掌握为绿色 ✅，模糊为黄色 ⚠️，不会为红色 ❌。
- `QuestionFilters` 布局为一行排列、移动端换行；包含分类 Tabs/ToggleGroup、难度 Select、答题状态 Select、搜索 Input。
- 分类筛选需提供 8 个分类与“全部”：HTML/CSS、JavaScript、浏览器原理、网络协议、框架原理、工程化、TypeScript、新技术。
- 搜索框使用 300ms 防抖，并通过 `useRouter().push()` 更新 searchParams 触发服务端重新渲染；不使用客户端状态管理承载筛选状态。
- 主布局中的 Sidebar 仅在 `/questions` 路由下展示，显示分类树、当前高亮分类与每个分类的题目数 badge；点击分类更新 `?category=`。
- 移动端在宽度小于 768px 时隐藏 Sidebar，Navbar 左侧展示汉堡菜单，点击后打开 Shadcn/ui `Sheet` 抽屉形式的 `MobileSidebar`。

**Independent Test**: 可通过“登录后进入题库 → 组合分类/难度/状态/搜索条件 → 翻页 → 复制 URL 在新标签页打开后结果一致”独立验证，并形成可直接使用的刷题检索体验。

**Acceptance Scenarios**:

1. **Given** 用户位于题库列表页，**When** 选择 `JavaScript` 分类并输入关键词，**Then** 列表仅展示符合条件的题目，且 URL 同步更新筛选参数。
2. **Given** 用户选择答题状态为“未答”，**When** 页面重新加载，**Then** 仅返回当前用户尚未产生答题记录的题目。
3. **Given** 用户在移动端访问题库，**When** 点击 Navbar 汉堡按钮，**Then** 系统打开抽屉侧边栏并允许切换分类。
4. **Given** 用户位于任意筛选组合下，**When** 切换分页，**Then** 系统保留现有筛选条件并按每页 20 条展示结果。

---

### 用户故事 3 - 用户查看题目详情、渐进式答案并完成自评 (Priority: P1)

作为正在刷题的用户，我希望进入单题详情页后查看题目正文、按层展开答案，并对自己的掌握程度做自评，以便形成连续学习闭环并保留刷题状态。

**Why this priority**: 没有题目详情、自评与答案展示，题库只能做静态浏览，无法支撑“刷题 + 复盘 + 进度追踪”的核心价值。

**Technical Implementation**:

- 题目详情页位于 `app/(main)/questions/[id]/page.tsx`，使用 Server Component 根据 `params.id` 查询题目详情、当前用户答题状态、收藏状态以及上一题/下一题 ID。
- 页面结构需包含：返回题目列表、题目在整体中的位置、难度与分类元信息、Markdown 正文、三层答案区域、自评按钮区、上下题导航与收藏按钮。
- `AnswerAccordion` 基于 Shadcn/ui `Accordion`，三层结构依次为：
  - `question.answerHint` → “💡 思路提示”；
  - `question.answer` → “📝 参考答案”；
  - `question.deepKnowledge` → “🔬 深入知识点”。
- 三层答案默认均折叠；若某层字段为 `null` 或空值，则不展示该层。
- Markdown 内容通过 `MarkdownRenderer` 组件渲染，依赖 `react-markdown`、`rehype-highlight`、`rehype-raw`、`remark-gfm`，需支持标准 Markdown、GFM 表格/任务列表/删除线、代码块高亮、行内代码样式及 Tailwind Typography 排版。
- `SelfAssessment` 为客户端组件，Props 为 `questionId: string, currentStatus?: AnswerStatus`，展示“掌握 / 模糊 / 不会”三个按钮；颜色与选中态分别为绿色、黄色、红色实心背景。
- 点击自评按钮后调用 Server Action `upsertAnswer(questionId, status)`，服务端通过 `prisma.userAnswer.upsert()` 按 `@@unique([userId, questionId])` 覆盖写入状态；前端采用乐观更新，并在提交后 `revalidatePath` 刷新页面数据。
- `QuestionNav` 的 Props 为 `prevId` 与 `nextId`；服务端需基于当前筛选条件计算前后题目，并在跳转时保留当前 URL query 参数；若不存在前一题或后一题，则对应按钮置灰不可用。
- 题目详情页中的收藏按钮与题库卡片右上角收藏能力保持一致，支持在详情页直接收藏或取消收藏。

**Independent Test**: 可通过“从题库进入详情 → 展开不同层级答案 → 点击掌握/模糊/不会 → 刷新后状态保持 → 使用上一题/下一题连续切换”独立验证，并形成完整刷题学习闭环。

**Acceptance Scenarios**:

1. **Given** 用户进入某题详情页，**When** 点击“思路提示”或“参考答案”，**Then** 系统展开对应层级内容并按 Markdown 正确渲染。
2. **Given** 某题没有 `deepKnowledge` 内容，**When** 页面加载，**Then** 系统不展示“深入知识点”这一层。
3. **Given** 用户当前自评状态为空，**When** 点击“✅ 掌握”，**Then** 系统立即高亮掌握按钮并在刷新后保留 `MASTERED` 状态。
4. **Given** 用户处于带筛选条件的刷题链路中，**When** 点击“下一题”，**Then** 系统跳转到下一题并保留当前筛选参数。

---

### 用户故事 4 - 用户收藏题目并在收藏列表统一复习 (Priority: P2)

作为正在准备面试的用户，我希望可以收藏重点题目，并在专门的收藏列表页统一查看，以便集中复习高频难点和待巩固内容。

**Why this priority**: 收藏不是题库基础访问的前置条件，但它能显著提升复习效率，是 MVP 中增强学习闭环的重要能力。

**Technical Implementation**:

- 收藏按钮组件为 `FavoriteButton`，出现在题目详情页和题目卡片右上角，属于客户端组件。
- `FavoriteButton` Props 为 `questionId: string, isFavorited: boolean`。
- 行为定义：
  - 未收藏时点击 → 调用 `addFavorite(questionId)` → 星标变为实心 `⭐`；
  - 已收藏时点击 → 调用 `removeFavorite(questionId)` → 星标变为空心 `☆`；
  - 前端需要做乐观更新。
- 收藏列表页位于 `app/(main)/favorites/page.tsx`，使用 Server Component 查询 `UserFavorite JOIN Question`。
- 收藏列表展示层复用 `QuestionList` 与 `QuestionCard`，保持与题库列表一致的视觉和交互模式。
- 当收藏为空时，显示空状态文案“还没有收藏的题目哦，去题库看看吧”，并提供跳转回题库的按钮。
- 收藏数据由 `UserFavorite` 模型承载，对 `(userId, questionId)` 建立唯一约束，防止重复收藏。

**Independent Test**: 可通过“在题目卡片或详情页收藏题目 → 进入收藏页查看 → 取消收藏后列表同步变化”独立验证，并单独交付复习清单能力。

**Acceptance Scenarios**:

1. **Given** 用户未收藏某题，**When** 点击收藏按钮，**Then** 系统立即显示已收藏状态并将该题写入用户收藏列表。
2. **Given** 用户已收藏某题，**When** 再次点击收藏按钮，**Then** 系统取消收藏并恢复空心星标。
3. **Given** 用户进入收藏列表页，**When** 已有收藏数据，**Then** 页面以题目卡片列表形式展示所有收藏题目。
4. **Given** 用户没有任何收藏题目，**When** 进入收藏页，**Then** 页面展示空状态文案和跳转题库按钮。

---

### 用户故事 5 - 用户查看 Dashboard 统计与分类学习进度 (Priority: P2)

作为持续刷题的用户，我希望在 Dashboard 中看到总题数、已掌握/模糊/未答数量、分类进度和最近答题记录，以便判断当前学习进展并安排下一步复习计划。

**Why this priority**: 统计视图是进度追踪的结果呈现层，虽可晚于刷题核心能力上线，但对提升用户复盘效率和持续使用意愿非常关键。

**Technical Implementation**:

- Dashboard 页面位于 `app/(main)/dashboard/page.tsx`。
- 页面需要展示欢迎语 `{userName}`、总题数、已掌握数、模糊数、未答题数、各分类进度条、最近答题记录。
- 统计查询至少包含三部分：
  - 使用 `prisma.userAnswer.groupBy({ by: ['status'], where: { userId }, _count: true })` 计算各答题状态总数；
  - 使用原生 SQL / `$queryRaw` 联合 `Question` 与 `UserAnswer` 计算各分类总题数与已掌握题数；
  - 使用 `prisma.userAnswer.findMany` 按 `updatedAt desc` 查询最近 10 条答题记录，并带出题目 `id/title`。
- 分类进度展示需体现每个分类的已掌握进度，例如 `40/50` 和百分比。
- 最近答题记录按时间倒序展示，示例状态包括“✅ 掌握”“⚠️ 模糊”。
- 用户中心/刷题统计页与 Dashboard 共同构成主导航中的“统计/个人中心”能力范围。

**Independent Test**: 可通过“完成若干道题自评 → 返回 Dashboard → 查看卡片统计、分类进度和最近答题列表是否准确”独立验证，并直接交付学习数据反馈能力。

**Acceptance Scenarios**:

1. **Given** 用户已有多道题的自评记录，**When** 进入 Dashboard，**Then** 页面展示准确的总题数、已掌握、模糊和未答题数量。
2. **Given** 用户在多个分类下完成不同数量题目，**When** 查看 Dashboard，**Then** 页面按分类显示对应的掌握进度条与数值。
3. **Given** 用户最近完成了新的自评，**When** 返回 Dashboard，**Then** 最近答题区域按时间倒序展示最新记录。

---

### 用户故事 6 - 访客访问 Landing Page 并被引导开始刷题 (Priority: P3)

作为首次访问平台的访客，我希望在未登录时看到清晰的产品介绍页，并通过明确的 CTA 进入登录流程，以便快速理解产品价值并开始使用。

**Why this priority**: Landing Page 主要承担转化与介绍作用，不是刷题主路径的阻塞项，因此优先级低于鉴权、题库和详情，但属于一期范围内的对外入口。

**Technical Implementation**:

- Landing Page 位于 `app/page.tsx`。
- 页面逻辑：若用户已登录，则直接重定向到 `/dashboard`；未登录时展示产品介绍首页。
- 页面内容至少包括：
  - Hero 标题“前端面试，从恐慌到自信”；
  - 副标题“体系化八股题库 · 渐进式答案 · 刷题进度追踪”；
  - CTA 按钮“开始刷题”，点击跳转 `/login`。
- Features 区域需展示产品卖点：
  - `1000+` 高频面试题，8 大分类体系；
  - 渐进式答案：思路提示 → 参考答案 → 深入知识；
  - 刷题进度追踪，掌握/模糊/不会一目了然；
  - 按分类/难度/状态精准筛选。
- Navbar、Footer 与整体视觉语言需与主应用基础 UI 框架保持一致。

**Independent Test**: 可通过“未登录访问首页 → 查看产品介绍 → 点击开始刷题进入登录页；已登录访问首页直接进入 Dashboard”独立验证，并形成对外可访问入口。

**Acceptance Scenarios**:

1. **Given** 用户未登录访问 `/`，**When** 页面加载，**Then** 系统展示 Landing Page 的 Hero、特性介绍和 CTA 按钮。
2. **Given** 用户点击“开始刷题”，**When** 跳转发生，**Then** 系统进入 `/login` 页面。
3. **Given** 用户已登录后访问 `/`，**When** 页面加载，**Then** 系统直接重定向到 `/dashboard`。

### 边界情况

- 用户注册时邮箱已存在，系统需阻止重复创建账号并展示明确错误信息。
- 用户使用错误密码登录时，系统需提示“邮箱或密码错误”，不能暴露更多鉴权细节。
- 未登录用户访问任意受保护页面时必须统一跳转登录页。
- 题目某一层答案为空时，对应 Accordion 分层不展示，避免空白内容块。
- 在当前筛选条件下不存在上一题或下一题时，导航按钮需 disabled。
- 收藏列表为空时需展示空状态，不应出现空白页面。
- 移动端宽度小于 768px 时，侧边栏必须折叠为抽屉，不能挤压主内容区。
- 当搜索、分类、难度、状态同时组合时，URL 必须能完整表达筛选条件并在刷新后恢复。
- 当用户重复点击同一自评状态或收藏按钮时，系统应保持最终状态一致，不出现重复记录。
- 未配置 GitHub OAuth 环境变量时，系统应视为环境配置不完整；一期要求在本地、测试、生产等目标环境均完成 GitHub OAuth 配置并保证可用。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须提供基于邮箱密码的注册和登录能力，并支持 GitHub OAuth 登录。
- **FR-002**: 系统必须在注册时校验姓名、邮箱、密码和确认密码字段，其中密码满足长度与复杂度要求。
- **FR-003**: 系统必须在登录成功后将用户引导到 `/dashboard`，并在登录失败时给出明确错误提示。
- **FR-004**: 系统必须保护 `(main)` 路由组下所有页面，未登录访问时统一跳转 `/login`。
- **FR-005**: 系统必须允许已登录用户从 Navbar 菜单安全登出并返回首页。
- **FR-006**: 系统必须提供题目列表页，支持按分类、难度、标签、答题状态、关键词和分页进行浏览。
- **FR-007**: 系统必须将题库筛选条件编码到 URL query 中，并在刷新或分享链接后恢复相同结果。
- **FR-008**: 系统必须在题目卡片中展示题目元信息、摘要、用户状态和收藏状态。
- **FR-009**: 系统必须提供题目详情页，并支持返回列表、查看当前位置、上下题跳转及保留当前筛选上下文。
- **FR-010**: 系统必须按“思路提示 → 参考答案 → 深入知识点”的顺序提供渐进式答案展示，并在内容缺失时隐藏对应层级。
- **FR-011**: 用户必须能够对每道题执行“掌握 / 模糊 / 不会”自评，且刷新后状态保持不变。
- **FR-012**: 系统必须支持用户收藏和取消收藏题目，并提供收藏列表页统一查看。
- **FR-013**: 系统必须提供 Dashboard，用于展示总题数、各状态数量、分类进度与最近答题记录。
- **FR-014**: 系统必须为未登录访客提供 Landing Page，并通过 CTA 引导进入登录流程。
- **FR-015**: 系统必须支持响应式布局，在移动端将题库侧边栏切换为抽屉交互。
- **FR-016**: 系统必须提供首批 150 道种子题目数据，覆盖 8 个分类及对应知识重点。
- **FR-017**: 系统必须包含基础 UI 框架，至少覆盖 Navbar、Sidebar、Footer、Loading、EmptyState、Pagination、SearchInput 等共享组件。
- **FR-018**: 系统必须提供 `server/actions/questions.ts`、`answers.ts`、`favorites.ts` 中定义的服务端能力，以支持列表、详情、自评、统计、收藏等核心流程。

### Key Entities *(include if feature involves data)*

- **User**: 平台用户，包含姓名、邮箱、密码哈希、头像、会话、OAuth 账号、答题记录、收藏记录以及创建/更新时间。
- **Account**: 用户第三方登录账号映射，记录 provider、providerAccountId、token 等 OAuth 信息，并关联 `User`。
- **Session**: 用户会话实体，记录 `sessionToken`、过期时间和所属用户。
- **VerificationToken**: 鉴权流程使用的验证令牌实体。
- **Question**: 题库题目，包含标题、正文、思路提示、参考答案、深入知识点、分类、二级分类、难度、标签、排序权重及时间戳。
- **QuestionTag**: 题目标签实体，用于为题目打上“闭包”“原型链”等主题标签。
- **UserAnswer**: 用户答题状态记录，描述某用户对某题的 `MASTERED / FUZZY / UNKNOWN` 状态，并要求 `(userId, questionId)` 唯一。
- **UserFavorite**: 用户收藏关系实体，记录某用户收藏了哪道题，并要求 `(userId, questionId)` 唯一。
- **Category**: 题目一级分类枚举，包括 HTML/CSS、JavaScript、浏览器原理、网络协议、框架原理、工程化、TypeScript、新技术。
- **Difficulty**: 题目难度枚举，包括初级、中级、高级、专家。
- **AnswerStatus**: 用户自评状态枚举，包括掌握、模糊、不会。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 新用户能够在 3 分钟内完成注册并成功进入 Dashboard 开始刷题。
- **SC-002**: 登录用户能够在 30 秒内通过分类、难度、状态或搜索至少一种方式定位到目标题目。
- **SC-003**: 用户对任意题目执行自评后，页面刷新后仍能正确看到相同状态，成功率达到 100%。
- **SC-004**: 用户能够在 1 分钟内完成“进入题目详情 → 展开答案 → 完成自评 → 返回继续刷题”的完整闭环。
- **SC-005**: 收藏用户能够在 30 秒内从任意题目加入收藏，并在收藏页再次找到该题。
- **SC-006**: Dashboard 能够正确展示用户最近 10 条答题记录及各分类掌握进度，人工抽样核对准确率达到 100%。
- **SC-007**: 首批题库成功导入 150 道题，覆盖 8 个预设分类，用户可在列表页完成浏览。

## 假设与约束

- 一期采用 Next.js App Router + Server Components + Server Actions 作为主要实现范式。
- 数据库存储采用 Neon PostgreSQL，ORM 固定为 Prisma。
- 部署目标为 Vercel，包管理工具固定为 pnpm。
- Session 策略采用 JWT，以适配 Serverless 场景。
- 暗黑主题在一期为可选项，可先保留 Provider 结构但不要求完整交付。
- 题库数据首批目标为 150 题，但 Landing Page 文案可以展示更长期的“1000+ 高频面试题”产品愿景。

## 附录：实现约束与参考信息

### 项目结构约束

```plaintext
interview-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── questions/page.tsx
│   │   ├── questions/[id]/page.tsx
│   │   ├── favorites/page.tsx
│   │   └── profile/page.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── server/
│   ├── auth.ts
│   ├── db.ts
│   └── actions/
│       ├── questions.ts
│       ├── answers.ts
│       └── favorites.ts
├── components/
│   ├── ui/
│   ├── layout/
│   ├── questions/
│   ├── auth/
│   └── shared/
├── lib/
├── prisma/
├── public/
└── 其他工程文件
```

### Server Actions 约束

- `getQuestions(params)`：返回带筛选与分页的题目列表、总数、总页数、当前页。
- `getQuestionById(id)`：返回单题详情、用户答题状态、收藏状态、上一题 ID、下一题 ID。
- `getAllTags()`：返回标签及数量。
- `getCategoryCounts()`：返回各分类题目数量。
- `upsertAnswer(questionId, status)`：写入或更新用户自评状态。
- `getUserStats()`：返回总量、各状态数量、分类进度、最近答题记录。
- `addFavorite(questionId)` / `removeFavorite(questionId)`：维护收藏关系。
- `getFavorites(params)`：返回收藏题目列表与总数。

### 种子数据约束

- HTML/CSS：20 题，覆盖 BFC、Flex/Grid、语义化、响应式、动画。
- JavaScript：40 题，覆盖闭包、原型链、this、Event Loop、Promise、ES6+。
- 浏览器原理：15 题，覆盖渲染流程、V8、垃圾回收、跨域、存储。
- 网络协议：15 题，覆盖 HTTP/HTTPS、TCP、缓存策略、WebSocket。
- 框架原理：25 题，覆盖 React Hooks/Fiber/Diff、Vue3 响应式。
- 工程化：15 题，覆盖 Webpack/Vite、Tree Shaking、CI/CD。
- TypeScript：15 题，覆盖泛型、类型体操、装饰器、类型推断。
- 新技术：5 题，覆盖 Web Components、WebAssembly。
- 合计 150 题。

### 环境变量约束

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="随机生成的32位字符串"
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"
```

### 开发验收顺序参考

1. 初始化 Next.js 与依赖后可正常启动开发环境。
2. TailwindCSS 与 Shadcn/ui 可渲染基础组件。
3. Prisma 与数据库连接成功并完成 Schema 落库。
4. NextAuth 生效，`/api/auth/signin` 可访问。
5. 注册、登录、OAuth、路由守卫逐步可用。
6. 主布局、题库列表、详情、自评、状态筛选、收藏、Dashboard、Landing Page、响应式适配逐项完成。
7. 最终部署至 Vercel 后线上可访问。