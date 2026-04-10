# 前端面试通关平台 — 一期 MVP PRD & 技术方案（AI-Native）

# 前端面试通关平台 — 一期 MVP PRD & 技术方案

> **文档定位**：本文档为 AI-Native 开发文档，可直接喂给 AI Coding Agent（Cursor / Claude）逐模块生成代码。每个功能点精确到组件、接口、数据结构、验收标准，不留模糊空间。

---

## 一、产品概述

### 1.1 一句话描述

一个前端面试八股文刷题平台，用户可以登录、按分类刷题、查看渐进式答案、记录学习状态、追踪刷题进度。

### 1.2 一期 MVP 范围

**做**：鉴权登录、题库浏览与筛选、题目详情与答案展示、答题自评与进度追踪、基础 UI 框架
**不做**：AI 追问、简历解析、手撕代码编辑器、面试通过概率、社区 UGC

### 1.3 技术选型定论

| 层级 | 技术 | 版本 |
| --- | --- | --- |
| 框架 | Next.js (App Router) | 14.x |
| 语言 | TypeScript | 5.x |
| UI | Shadcn/ui + Radix UI | latest |
| 样式 | TailwindCSS | 4.x |
| ORM | Prisma | 5.x |
| 数据库 | PostgreSQL (Neon) | 16 |
| 鉴权 | NextAuth.js | v5 (next-auth@beta) |
| 状态管理 | Zustand（客户端轻量状态） | 4.x |
| 部署 | Vercel | — |
| 包管理 | pnpm | 9.x |

---

## 二、项目结构（AI Agent 直接照此创建）

```plaintext
interview-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx              # 登录页
│   │   ├── register/
│   │   │   └── page.tsx              # 注册页
│   │   └── layout.tsx                # 鉴权页布局（居中卡片）
│   ├── (main)/
│   │   ├── layout.tsx                # 主布局（导航栏 + 侧边栏）
│   │   ├── dashboard/
│   │   │   └── page.tsx              # 首页仪表盘
│   │   ├── questions/
│   │   │   ├── page.tsx              # 题目列表页
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 题目详情页
│   │   ├── favorites/
│   │   │   └── page.tsx              # 收藏列表页
│   │   └── profile/
│   │       └── page.tsx              # 用户中心/刷题统计
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth API 路由
│   ├── layout.tsx                    # 根布局
│   ├── page.tsx                      # Landing Page（未登录首页）
│   └── globals.css
├── server/
│   ├── auth.ts                       # NextAuth 配置
│   ├── db.ts                         # Prisma Client 单例
│   └── actions/
│       ├── questions.ts              # 题目相关 Server Actions
│       ├── answers.ts                # 答题记录 Server Actions
│       └── favorites.ts              # 收藏相关 Server Actions
├── components/
│   ├── ui/                           # Shadcn/ui 组件（Button, Card, Badge...）
│   ├── layout/
│   │   ├── Navbar.tsx                # 顶部导航栏
│   │   ├── Sidebar.tsx               # 侧边栏（题目分类）
│   │   ├── MobileSidebar.tsx         # 移动端抽屉侧边栏
│   │   └── Footer.tsx                # 页脚
│   ├── questions/
│   │   ├── QuestionCard.tsx          # 题目列表卡片
│   │   ├── QuestionList.tsx          # 题目列表容器
│   │   ├── QuestionFilters.tsx       # 筛选栏（分类+难度+状态+搜索）
│   │   ├── QuestionDetail.tsx        # 题目详情展示
│   │   ├── AnswerAccordion.tsx       # 答案三层渐进展开
│   │   ├── SelfAssessment.tsx        # 自评按钮组（掌握/模糊/不会）
│   │   ├── QuestionNav.tsx           # 上一题/下一题导航
│   │   └── DifficultyBadge.tsx       # 难度标签组件
│   ├── auth/
│   │   ├── LoginForm.tsx             # 登录表单
│   │   ├── RegisterForm.tsx          # 注册表单
│   │   └── OAuthButtons.tsx          # OAuth 登录按钮组
│   └── shared/
│       ├── MarkdownRenderer.tsx      # Markdown 渲染器
│       ├── SearchInput.tsx           # 搜索输入框（防抖）
│       ├── Pagination.tsx            # 分页组件
│       ├── EmptyState.tsx            # 空状态占位
│       └── LoadingSpinner.tsx        # 加载态
├── lib/
│   ├── utils.ts                      # 通用工具（cn, formatDate...）
│   ├── constants.ts                  # 常量（分类、难度枚举）
│   └── validations.ts               # Zod Schema 校验
├── prisma/
│   ├── schema.prisma                 # 数据库 Schema
│   ├── seed.ts                       # 种子数据脚本
│   └── migrations/
├── public/
│   └── icons/                        # 分类图标
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 三、数据库设计（Prisma Schema）

以下为完整的 `prisma/schema.prisma`，AI Agent 可直接使用：

```plaintext
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ==================== 鉴权相关（NextAuth 要求） ====================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?   // 邮箱注册用户的密码哈希
  
  accounts      Account[]
  sessions      Session[]
  answers       UserAnswer[]
  favorites     UserFavorite[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ==================== 业务表 ====================

model Question {
  id              String   @id @default(cuid())
  title           String                          // 题目标题
  content         String   @db.Text               // 题目正文（Markdown）
  answerHint      String?  @db.Text               // 第一层：思路提示
  answer          String   @db.Text               // 第二层：参考答案（Markdown）
  deepKnowledge   String?  @db.Text               // 第三层：深入知识点
  category        Category                        // 一级分类（枚举）
  subCategory     String                          // 二级分类（自由文本）
  difficulty      Difficulty                      // 难度等级
  tags            QuestionTag[]
  answers         UserAnswer[]
  favorites       UserFavorite[]
  sortOrder       Int      @default(0)            // 排序权重
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([category])
  @@index([difficulty])
  @@index([category, difficulty])
}

model QuestionTag {
  id         String   @id @default(cuid())
  name       String                               // 标签名（如：闭包、原型链）
  questionId String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@index([name])
  @@index([questionId])
}

model UserAnswer {
  id         String       @id @default(cuid())
  userId     String
  questionId String
  status     AnswerStatus                         // 掌握/模糊/不会
  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  question   Question     @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  @@unique([userId, questionId])                  // 每用户每题一条记录，更新覆盖
  @@index([userId])
  @@index([userId, status])
}

model UserFavorite {
  id         String   @id @default(cuid())
  userId     String
  questionId String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  createdAt  DateTime @default(now())

  @@unique([userId, questionId])
  @@index([userId])
}

// ==================== 枚举 ====================

enum Category {
  HTML_CSS          // HTML/CSS
  JAVASCRIPT        // JavaScript
  BROWSER           // 浏览器原理
  NETWORK           // 网络协议
  FRAMEWORK         // 框架原理（React/Vue）
  ENGINEERING       // 工程化
  TYPESCRIPT        // TypeScript
  NEW_TECH          // 新技术
}

enum Difficulty {
  BEGINNER          // 初级
  INTERMEDIATE      // 中级
  ADVANCED          // 高级
  EXPERT            // 专家
}

enum AnswerStatus {
  MASTERED          // 掌握
  FUZZY             // 模糊
  UNKNOWN           // 不会
}
```

---

## 四、功能模块详细设计

### 模块 A：鉴权系统

#### A1. NextAuth 配置 — `server/auth.ts`

**功能**：统一管理鉴权逻辑
**Provider 列表**：

1. `CredentialsProvider` — 邮箱 + 密码登录
2. `GitHubProvider` — GitHub OAuth 登录

**Session 策略**：JWT（Serverless 友好，不依赖数据库 Session）

**关键配置**：

```typescript
// 伪代码，供 AI Agent 参考
export const authOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      // 邮箱 + 密码校验逻辑
      // bcrypt.compare(password, user.passwordHash)
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      // 将 userId 注入 session
      session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
```

#### A2. 注册页 — `app/(auth)/register/page.tsx`

**组件**：`RegisterForm`
**表单字段**：

| 字段 | 类型 | 校验规则 |
| --- | --- | --- |
| name | string | 必填，2-50 字符 |
| email | string | 必填，合法邮箱格式，数据库唯一 |
| password | string | 必填，8-100 字符，至少一个大写 + 一个数字 |
| confirmPassword | string | 必填，与 password 一致 |

**Server Action**：`registerUser(formData)`

- 校验 → bcrypt 哈希密码 → 创建 User → 自动登录 → 跳转 `/dashboard`
- 邮箱已存在 → 返回错误提示

**UI 要求**：

- 居中卡片布局，宽度 max-w-md
- 表单底部有「已有账号？去登录」链接
- 底部展示 GitHub OAuth 按钮，分割线「或」
- 提交时 Button loading 态

#### A3. 登录页 — `app/(auth)/login/page.tsx`

**组件**：`LoginForm`
**表单字段**：

| 字段 | 类型 | 校验规则 |
| --- | --- | --- |
| email | string | 必填，合法邮箱 |
| password | string | 必填 |

**行为**：

- 校验 → NextAuth `signIn("credentials")` → 成功跳转 `/dashboard`
- 密码错误 → toast 提示「邮箱或密码错误」
- GitHub 登录 → `signIn("github")`

**UI 要求**：

- 与注册页同布局
- 底部「没有账号？去注册」链接
- GitHub OAuth 按钮

#### A4. 路由守卫 — `app/(main)/layout.tsx`

**逻辑**：

```typescript
const session = await auth();
if (!session) redirect("/login");
```

- `(main)` 组下所有页面均受保护
- `(auth)` 组不受保护（登录/注册页）
- 已登录用户访问 `/login` → 重定向到 `/dashboard`

#### A5. 登出

**位置**：Navbar 用户菜单下拉
**行为**：调用 `signOut()` → 清除 Session → 跳转首页 /

---

### 模块 B：全局布局与导航

#### B1. 根布局 — `app/layout.tsx`

- 设置全局字体（Inter）、metadata（title/description/favicon）
- 包裹 `SessionProvider`（NextAuth）
- 包裹 `ThemeProvider`（明/暗主题，可选一期先不做）
- 引入 `globals.css`（TailwindCSS）
- 包裹 `Toaster`（sonner toast 通知）

#### B2. 主布局 — `app/(main)/layout.tsx`

**结构**：

```plaintext
┌──────────────────────────────────────┐
│              Navbar                  │
├──────────┬───────────────────────────┤
│          │                           │
│ Sidebar  │       Main Content        │
│ (240px)  │       (flex-1)            │
│          │                           │
│          │                           │
├──────────┴───────────────────────────┤
│              Footer（可选）           │
└──────────────────────────────────────┘
```

**Navbar 组件**：

- 左：Logo + 产品名「面试通关」
- 中：导航链接 — 题库、收藏、统计（active 态高亮）
- 右：用户头像 → 下拉菜单（个人中心、登出）

**Sidebar 组件**：

- 仅在 `/questions` 路由下显示
- 展示题目分类树：

```plaintext
📁 HTML/CSS
📁 JavaScript
📁 浏览器原理
📁 网络协议
📁 框架原理
📁 工程化
📁 TypeScript
📁 新技术
```

- 点击分类 → URL query 参数 `?category=JAVASCRIPT`
- 当前选中分类高亮
- 每个分类后显示题目数量 badge

**MobileSidebar 组件**：

- 屏幕宽度 < 768px 时，Sidebar 隐藏
- Navbar 左侧出现汉堡菜单按钮
- 点击打开 Sheet 抽屉（Shadcn/ui Sheet 组件）

---

### 模块 C：题库核心

#### C1. 题目列表页 — `app/(main)/questions/page.tsx`

**数据获取**：React Server Component，直接调用 Prisma 查询

**URL Query 参数**（所有筛选通过 URL 管理，支持分享链接）：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| category | Category enum | 空（全部） | 一级分类 |
| difficulty | Difficulty enum | 空（全部） | 难度 |
| tag | string | 空 | 标签名 |
| status | <code>all/unanswered/mastered/fuzzy/unknown</code> | all | 答题状态 |
| search | string | 空 | 搜索关键词 |
| page | number | 1 | 当前页码 |

**查询逻辑**（Prisma where 条件拼装）：

```typescript
const where: Prisma.QuestionWhereInput = {
  ...(category && { category }),
  ...(difficulty && { difficulty }),
  ...(tag && { tags: { some: { name: tag } } }),
  ...(search && {
    OR: [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ],
  }),
};

// 答题状态筛选需要 JOIN user_answers
if (status === "unanswered") {
  where.answers = { none: { userId: currentUserId } };
} else if (status === "mastered" || status === "fuzzy" || status === "unknown") {
  where.answers = { some: { userId: currentUserId, status: statusMap[status] } };
}
```

**分页**：每页 20 条，Prisma `skip` + `take`

**展示**：

- 顶部：`QuestionFilters` 组件（分类 Tab + 难度下拉 + 状态下拉 + 搜索框）
- 中部：`QuestionList` → 多个 `QuestionCard`
- 底部：`Pagination` 组件

#### C2. QuestionCard 组件

**展示字段**：

```plaintext
┌─────────────────────────────────────────┐
│ [中级] [JavaScript] [闭包]  [原型链]     │  ← 难度Badge + 分类 + 标签
│                                         │
│ 说说你对闭包的理解？                      │  ← 题目标题（可点击跳转详情）
│                                         │
│ 闭包是指有权访问另一个函数作用域中变量...    │  ← 内容摘要（前80字 + ...）
│                                         │
│ ✅ 已掌握                    ⭐ 已收藏    │  ← 用户状态 + 收藏标记
└─────────────────────────────────────────┘
```

**状态图标**：

- 未答题：灰色圆圈 ○
- 已掌握：绿色 ✅
- 模糊：黄色 ⚠️
- 不会：红色 ❌

**点击行为**：整个 Card 可点击，跳转到 `/questions/[id]`

#### C3. QuestionFilters 组件

**布局**：一行排列，移动端换行

| 筛选项 | 组件类型 | 行为 |
| --- | --- | --- |
| 分类 | Tabs 或 ToggleGroup | 8 个分类 Tab + 「全部」，点击更新 URL <code>?category=</code> |
| 难度 | Select 下拉 | 「全部/初级/中级/高级/专家」 |
| 答题状态 | Select 下拉 | 「全部/未答/已掌握/模糊/不会」 |
| 搜索 | Input + 搜索图标 | 300ms 防抖，更新 URL <code>?search=</code> |

**重要**：所有筛选操作通过 `useRouter().push()` 更新 URL searchParams，触发 Server Component 重新渲染。不使用客户端状态管理筛选。

#### C4. 题目详情页 — `app/(main)/questions/[id]/page.tsx`

**数据获取**：Server Component，根据 `params.id` 查询题目 + 当前用户的答题状态 + 收藏状态

**页面结构**：

```plaintext
┌─────────────────────────────────────────┐
│ ← 返回题目列表          题目 23/150       │  ← 返回 + 当前位置
│                                         │
│ [中级] [JavaScript]                      │  ← 元信息
│                                         │
│ # 说说你对闭包的理解？                    │  ← 题目标题
│                                         │
│ 闭包是一个非常核心的 JavaScript 概念...    │  ← 题目正文（Markdown 渲染）
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ 💡 思路提示              [点击展开 ▼]     │  ← 第一层（默认折叠）
│                                         │
│ 📝 参考答案              [点击展开 ▼]     │  ← 第二层（默认折叠）
│                                         │
│ 🔬 深入知识点            [点击展开 ▼]     │  ← 第三层（默认折叠）
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ 你掌握了吗？                             │
│ [✅ 掌握]  [⚠️ 模糊]  [❌ 不会]          │  ← 自评按钮
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ [← 上一题]              [下一题 →]       │  ← 题目导航
│ [⭐ 收藏/取消收藏]                        │  ← 收藏按钮
└─────────────────────────────────────────┘
```

#### C5. AnswerAccordion 组件

**类型**：Shadcn/ui `Accordion` 组件
**三层结构**：

| 层 | 标题 | 字段 | 默认状态 |
| --- | --- | --- | --- |
| 1 | 💡 思路提示 | <code>question.answerHint</code> | 折叠 |
| 2 | 📝 参考答案 | <code>question.answer</code> | 折叠 |
| 3 | 🔬 深入知识点 | <code>question.deepKnowledge</code> | 折叠 |

- 如果某层内容为 null/空，不显示该层
- 内容使用 `MarkdownRenderer` 渲染（支持代码高亮）

#### C6. SelfAssessment 组件

**类型**：客户端组件（`"use client"`）
**Props**：`questionId: string, currentStatus?: AnswerStatus`
**UI**：三个按钮并排

| 按钮 | 值 | 颜色 | 选中态 |
| --- | --- | --- | --- |
| ✅ 掌握 | MASTERED | green | 实心绿色背景 |
| ⚠️ 模糊 | FUZZY | yellow | 实心黄色背景 |
| ❌ 不会 | UNKNOWN | red | 实心红色背景 |

**行为**：

- 点击按钮 → 调用 Server Action `upsertAnswer(questionId, status)`
- Server Action 执行 `prisma.userAnswer.upsert()`
- 乐观更新：点击后立即切换 UI，不等接口返回
- `revalidatePath` 刷新页面数据

#### C7. QuestionNav 组件

**Props**：`prevId: string | null, nextId: string | null`
**逻辑**：

- 后端查询时同时获取当前筛选条件下的前一题和后一题 ID
- 使用 `Link` 组件跳转，保留当前 URL query 参数（分类筛选等）
- prevId 为 null → 「上一题」按钮 disabled
- nextId 为 null → 「下一题」按钮 disabled

#### C8. MarkdownRenderer 组件

**依赖**：`react-markdown` + `rehype-highlight` + `rehype-raw` + `remark-gfm`
**功能**：

- 标准 Markdown 渲染（标题、段落、列表、链接、图片）
- GFM 扩展（表格、任务列表、删除线）
- 代码块语法高亮（支持 javascript, typescript, html, css, jsx, tsx）
- 行内代码 `code` 样式
- 自定义样式（prose 排版，TailwindCSS Typography）

---

### 模块 D：收藏功能

#### D1. 收藏按钮 — `FavoriteButton`

**位置**：题目详情页、题目卡片右上角
**类型**：客户端组件
**Props**：`questionId: string, isFavorited: boolean`
**行为**：

- 未收藏 → 点击 → `addFavorite(questionId)` → 星星变实心 ⭐
- 已收藏 → 点击 → `removeFavorite(questionId)` → 星星变空心 ☆
- 乐观更新

#### D2. 收藏列表页 — `app/(main)/favorites/page.tsx`

- Server Component 查询 `UserFavorite` JOIN `Question`
- 复用 `QuestionList` + `QuestionCard` 展示
- 空状态：「还没有收藏的题目哦，去题库看看吧」+ 跳转按钮

---

### 模块 E：用户中心 / 刷题统计

#### E1. Dashboard 首页 — `app/(main)/dashboard/page.tsx`

**展示内容**：

```plaintext
┌─────────────────────────────────────────┐
│ 👋 欢迎回来，{userName}！                │
│                                         │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐│
│ │  150  │ │  42   │ │  28   │ │  80   ││
│ │ 总题数 │ │ 已掌握 │ │  模糊  │ │ 未答题 ││
│ └───────┘ └───────┘ └───────┘ └───────┘│
│                                         │
│ 各分类进度                               │
│ JavaScript    ████████░░  80%  (40/50)  │
│ HTML/CSS      ██████░░░░  60%  (18/30)  │
│ 浏览器原理     ███░░░░░░░  30%  (6/20)   │
│ ...                                     │
│                                         │
│ 最近答题                                 │
│ • 说说你对闭包的理解 — ✅ 掌握 — 2分钟前   │
│ • Event Loop 原理 — ⚠️ 模糊 — 10分钟前   │
│ • ...                                   │
└─────────────────────────────────────────┘
```

**数据查询**：

```typescript
// 各状态总数
const stats = await prisma.userAnswer.groupBy({
  by: ['status'],
  where: { userId },
  _count: true,
});

// 各分类进度
const categoryProgress = await prisma.$queryRaw`
  SELECT q.category, 
         COUNT(DISTINCT q.id) as total,
         COUNT(DISTINCT CASE WHEN ua.status = 'MASTERED' THEN q.id END) as mastered
  FROM "Question" q
  LEFT JOIN "UserAnswer" ua ON ua."questionId" = q.id AND ua."userId" = ${userId}
  GROUP BY q.category
`;

// 最近答题记录
const recentAnswers = await prisma.userAnswer.findMany({
  where: { userId },
  include: { question: { select: { id: true, title: true } } },
  orderBy: { updatedAt: 'desc' },
  take: 10,
});
```

---

### 模块 F：Landing Page（未登录首页）

#### F1. 首页 — `app/page.tsx`

**逻辑**：已登录 → redirect `/dashboard`；未登录 → 展示 Landing Page

**页面结构**：

```plaintext
Hero Section:
  标题：「前端面试，从恐慌到自信」
  副标题：「体系化八股题库 · 渐进式答案 · 刷题进度追踪」
  CTA 按钮：「开始刷题」→ /login

Features Section:
  - 📚 1000+ 高频面试题，8 大分类体系
  - 💡 渐进式答案：思路提示 → 参考答案 → 深入知识
  - 📊 刷题进度追踪，掌握/模糊/不会一目了然
  - 🔍 智能筛选，按分类/难度/状态精准刷题
```

---

## 五、Server Actions 接口定义

所有 Server Actions 位于 `server/actions/` 目录，通过 `"use server"` 标记。

### 5.1 题目相关 — `server/actions/questions.ts`

```typescript
// 获取题目列表（带筛选+分页）
async function getQuestions(params: {
  category?: Category;
  difficulty?: Difficulty;
  tag?: string;
  status?: "all" | "unanswered" | "mastered" | "fuzzy" | "unknown";
  search?: string;
  page?: number;
  pageSize?: number;  // 默认 20
}): Promise<{
  questions: QuestionWithMeta[];  // 题目 + 标签 + 用户答题状态
  total: number;
  totalPages: number;
  currentPage: number;
}>

// 获取单个题目详情
async function getQuestionById(id: string): Promise<{
  question: QuestionFull;         // 含所有字段 + 标签
  userAnswer?: UserAnswer;        // 当前用户答题状态
  isFavorited: boolean;           // 是否收藏
  prevId: string | null;          // 上一题 ID
  nextId: string | null;          // 下一题 ID
}>

// 获取所有标签列表（供筛选用）
async function getAllTags(): Promise<{ name: string; count: number }[]>

// 获取各分类题目数量（供侧边栏用）
async function getCategoryCounts(): Promise<Record<Category, number>>
```

### 5.2 答题记录 — `server/actions/answers.ts`

```typescript
// 自评答题（upsert）
async function upsertAnswer(
  questionId: string,
  status: AnswerStatus
): Promise<UserAnswer>

// 获取刷题统计
async function getUserStats(): Promise<{
  total: number;
  mastered: number;
  fuzzy: number;
  unknown: number;
  unanswered: number;
  categoryProgress: { category: Category; total: number; mastered: number }[];
  recentAnswers: { question: { id: string; title: string }; status: AnswerStatus; updatedAt: Date }[];
}>
```

### 5.3 收藏相关 — `server/actions/favorites.ts`

```typescript
// 添加收藏
async function addFavorite(questionId: string): Promise<void>

// 取消收藏
async function removeFavorite(questionId: string): Promise<void>

// 获取收藏列表
async function getFavorites(params: {
  page?: number;
  pageSize?: number;
}): Promise<{
  questions: QuestionWithMeta[];
  total: number;
}>
```

---

## 六、种子数据规范

### 6.1 种子脚本 — `prisma/seed.ts`

执行命令：`pnpm prisma db seed`

### 6.2 题目数据格式（JSON）

每道题需要包含：

```typescript
interface SeedQuestion {
  title: string;           // 题目标题（一句话）
  content: string;         // 题目正文（Markdown，可包含代码块）
  answerHint: string;      // 思路提示（1-3 句话）
  answer: string;          // 参考答案（Markdown，详细）
  deepKnowledge?: string;  // 深入知识点（可选）
  category: Category;      // 一级分类
  subCategory: string;     // 二级分类
  difficulty: Difficulty;   // 难度
  tags: string[];          // 标签数组
}
```

### 6.3 首批数据目标

| 分类 | 题数 | 覆盖重点 |
| --- | --- | --- |
| HTML/CSS | 20 | BFC、Flex/Grid、语义化、响应式、动画 |
| JavaScript | 40 | 闭包、原型链、this、Event Loop、Promise、ES6+ |
| 浏览器原理 | 15 | 渲染流程、V8、垃圾回收、跨域、存储 |
| 网络协议 | 15 | HTTP/HTTPS、TCP、缓存策略、WebSocket |
| 框架原理 | 25 | React Hooks/Fiber/Diff、Vue3 响应式 |
| 工程化 | 15 | Webpack/Vite、Tree Shaking、CI/CD |
| TypeScript | 15 | 泛型、类型体操、装饰器、类型推断 |
| 新技术 | 5 | Web Components、WebAssembly |
| <strong>合计</strong> | <strong>150</strong> |   |

---

## 七、环境变量清单

```bash
# .env.local

# 数据库（Neon PostgreSQL）
DATABASE_URL="postgresql://user:pass@ep-xxx.region.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.region.neon.tech/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="随机生成的32位字符串"

# GitHub OAuth
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"
```

---

## 八、开发步骤清单（按顺序执行）

以下为 AI Agent 的执行顺序，每步完成后可验证：

| 步骤 | 任务 | 验证标准 |
| --- | --- | --- |
| 1 | <code>pnpm create next-app</code> + 安装依赖 | <code>pnpm dev</code> 启动无报错 |
| 2 | 配置 TailwindCSS + Shadcn/ui | 页面能渲染 Shadcn Button |
| 3 | 配置 Prisma + 数据库连接 | <code>pnpm prisma db push</code> 成功 |
| 4 | 实现 Schema + 迁移 | 数据库表已创建 |
| 5 | 配置 NextAuth | <code>/api/auth/signin</code> 可访问 |
| 6 | 实现注册页 + Server Action | 能注册新用户 |
| 7 | 实现登录页 + OAuth | 邮箱密码和 GitHub 登录均可用 |
| 8 | 实现路由守卫 | 未登录访问 /questions → 跳转 /login |
| 9 | 实现主布局（Navbar + Sidebar） | 导航栏和侧边栏正常展示 |
| 10 | 实现种子数据导入 | 数据库有 150 道题 |
| 11 | 实现题目列表页 + 筛选 | 分类/难度/搜索均可用 |
| 12 | 实现题目详情页 + 答案展示 | 三层答案可展开 |
| 13 | 实现自评功能 | 点击掌握/模糊/不会，刷新后状态保持 |
| 14 | 实现答题状态筛选 | 列表页可按已答/未答筛选 |
| 15 | 实现收藏功能 | 收藏/取消，收藏列表页可查看 |
| 16 | 实现 Dashboard 统计 | 首页展示刷题进度和统计数据 |
| 17 | 实现 Landing Page | 未登录首页展示产品介绍 |
| 18 | 响应式适配 | 移动端侧边栏折叠，卡片单列 |
| 19 | 部署到 Vercel | 线上可访问 |

