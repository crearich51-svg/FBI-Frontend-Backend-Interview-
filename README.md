## Po主是被ai焦虑焦失业焦虑面试焦虑暑期焦虑逼疯的FE大学生，因为昨天前天接连挂了两场一面自信心受挫，所以有了它
## 此为本人几十场面试下来的沉淀产物+搜刮互联网上所有面经，顺便帮着复习

## Q&A：

-我瞧不起看不上你这种纯背诵吟唱八股的行为，你是大水货
-其实背熟了就是能进大厂（运气加持的情况下，建议每天积善行德）

-背完就忘怎么办，你这个题库权威吗？
-对我来说够用了，从大二找实习开始就想干这件事，搜集信息太累了当时是一篇一篇面经挨着找啊

-每个人的项目都不一样怎么办，面试肯定项目相关占比大啊
-是的，上传简历解析功能是二期要上的，强结合五花八门的FE项目（目前大家应该是AI对话/组件库/管理系统吧...）

# -你干这个有啥用，回来项目没完事前端没了
# -干FE光宗耀祖，干五年赚，干三年牛，干一年 值了！

# FBI 最适合苦比FE宝宝的面试刷题System MVP一期（架构）

支持注册登录、题库筛选、题目详情、自评、收藏、Dashboard 统计和 Landing Page。

## 技术栈

- Next.js 14 App Router
- TypeScript
- NextAuth v5 beta
- Prisma 5 + PostgreSQL
- Tailwind CSS 4
- react-hook-form + zod
- react-markdown + rehype-highlight
- sonner

## 目录结构

```text
app/          路由入口、layout、loading、route handler
features/     按业务域聚合的组件、server、schemas、types
shared/       跨 feature 复用的 UI、layout、providers、db、utils
prisma/       Schema 与 seed 脚本
specs/        SDD 设计文档与任务拆解
types/        全局声明（如 NextAuth 扩展）
```

当前采用 Hybrid feature 架构：

- `app/` 只保留 Next.js App Router 必需的页面与路由壳层
- `features/` 内部按业务域组织前后端代码，如 `auth`、`questions`、`favorites`、`dashboard`、`landing`
- `shared/` 只放真正跨域复用的能力，如导航、通用 UI、Providers、数据库客户端、工具函数
- `prisma/`、`app/api/`、全局配置文件保持在框架约定位置

## 本地启动

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，至少配置以下变量：

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

说明：

- `DATABASE_URL`：应用运行时数据库连接
- `DIRECT_URL`：Prisma 直连数据库地址，建议用于迁移与 schema 同步
- `NEXTAUTH_URL`：当前环境的站点地址
- `NEXTAUTH_SECRET`：用于加密 Session/JWT，生产环境必须使用高强度随机字符串
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`：GitHub OAuth 应用配置

### 3. 生成 Prisma Client

```bash
pnpm prisma:generate
```

### 4. 同步数据库结构

开发阶段可直接使用：

```bash
pnpm prisma:push
```

如果你使用 Prisma migration 流程，也可以执行：

```bash
pnpm prisma:migrate
```

### 5. 导入种子数据

```bash
pnpm db:seed
```

该脚本会导入一期题库所需的种子题目数据。

### 6. 启动开发环境

```bash
pnpm dev
```

默认访问地址：`http://localhost:3000`

## 常用脚本

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:migrate
pnpm db:seed
```

## 最小验证清单

在具备可用数据库与 OAuth 配置后，建议按以下顺序验证：

1. 未登录访问 `/questions`，应跳转到 `/login`
2. 用户可以完成邮箱注册、邮箱登录、登出
3. GitHub OAuth 可以从登录页跳转并回到 `/dashboard`
4. 题库支持分类、难度、状态、关键词筛选，且刷新后 URL 可恢复
5. 题目详情页支持三层答案展开、自评状态写入与切换
6. 收藏/取消收藏后，题库卡片、详情页与收藏页状态保持一致
7. Dashboard 能展示统计卡片、分类进度和最近答题记录
8. 移动端可正常使用顶部导航、分类抽屉、题目卡片与详情页交互

## 当前已完成的静态校验

以下命令已通过：

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

说明：涉及注册、登录、数据库读写、GitHub OAuth 的完整集成验证，仍需在真实 `.env.local` 配置下手动执行。

## Vercel 部署前检查

### 环境变量

在 Vercel 的 Preview 与 Production 环境中至少配置：

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

建议：

- Preview 与 Production 使用不同数据库或至少不同 schema
- `NEXTAUTH_SECRET` 按环境区分，不要复用本地值
- Neon / PostgreSQL 若区分 pooled 与 direct 连接，确保 `DATABASE_URL` 与 `DIRECT_URL` 分别填写正确

### GitHub OAuth 回调地址

GitHub OAuth App 中至少添加以下回调地址：

- 本地：`http://localhost:3000/api/auth/callback/github`
- 生产：`https://<your-vercel-domain>/api/auth/callback/github`

如果你有 Preview 域名单独登录需求，也要补充对应的 Vercel Preview 域名回调地址。

### 构建设置

Vercel 推荐使用：

- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Output Directory: `.next`（默认）

### 数据库初始化

首次部署前确认：

1. 生产库已执行 schema 同步或 migration
2. 是否需要执行 `pnpm db:seed`
3. 种子数据是否只用于演示环境，避免误导入生产正式数据

### 发布前自检

- 本地 `pnpm build` 通过
- 登录页、注册页、Landing Page 样式正常
- 主导航、题库页、详情页在移动端可用
- `/dashboard`、`/favorites`、`/questions/[id]` 在登录态下可正常访问
- GitHub OAuth 能成功跳回站点

## 相关文档

- 任务清单：`specs/20260409-frontend-interview-platform/tasks.md`
- 快速开始：`specs/20260409-frontend-interview-platform/quickstart.md`
