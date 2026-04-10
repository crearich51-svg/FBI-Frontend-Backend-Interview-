# 研究记录：前端面试通关平台一期 MVP

## 决策 1：采用 Next.js 14 App Router + Server Components + Server Actions
- **Decision**: 以前后端同仓的 Next.js 14 App Router 作为一期主体架构，页面数据读取优先使用 Server Components，用户交互写操作通过 Server Actions 承担。
- **Rationale**: 规格中的页面、鉴权、题库查询、详情页、自评、收藏和 Dashboard 都是典型的 SSR + 表单/按钮交互场景；该方案可以减少额外 API 层样板代码，天然适配 Vercel 部署，并与规格中给出的目录结构完全一致。
- **Alternatives considered**:
  - 传统 REST API + React 客户端数据请求：实现更分层，但一期样板代码更多、上下文切换成本更高。
  - 完全客户端渲染：不利于首屏展示、SEO 与服务端鉴权控制。

## 决策 2：鉴权使用 NextAuth v5 + Prisma Adapter + JWT Session
- **Decision**: 使用 NextAuth v5（beta）接入 Credentials + GitHub OAuth，两种登录方式共用 Prisma Adapter，Session 策略固定为 JWT。
- **Rationale**: 该方案与规格中数据库模型、环境变量和登录流程一致，且 JWT 更适合 Serverless/Vercel 场景，避免数据库 Session 额外维护成本。
- **Alternatives considered**:
  - 自建鉴权：灵活性高，但一期风险和实现成本不必要地上升。
  - 数据库 Session：可追踪性更强，但对当前部署模型不是必需。

## 决策 3：数据存储采用 Prisma + Neon PostgreSQL
- **Decision**: 使用 Prisma 管理 `User`、`Question`、`UserAnswer`、`UserFavorite` 等模型，数据库使用 Neon PostgreSQL。
- **Rationale**: 题库、收藏、自评、统计场景都需要结构化关系数据与联表查询；Prisma 可直接承接规格中的 schema 设计与迁移流程。
- **Alternatives considered**:
  - MongoDB 等文档数据库：不利于多条件筛选、关系建模和统计查询。
  - 本地文件或 SQLite：不适合作为部署到 Vercel 的长期方案。

## 决策 4：题库筛选状态以 URL Search Params 作为唯一事实来源
- **Decision**: 分类、难度、标签、答题状态、关键词与分页统一放入 URL query，由页面服务端读取后查询。
- **Rationale**: 规格明确要求支持分享链接、刷新恢复和不使用客户端状态承载筛选；search params 能直接满足这些要求。
- **Alternatives considered**:
  - Zustand 本地状态保存筛选：刷新不可恢复，分享链接不可复现。
  - localStorage 持久化：仅本地有效，不满足协作分享需求。

## 决策 5：客户端状态仅用于轻量交互，业务真值落库
- **Decision**: Zustand 仅保留给少量前端交互扩展空间；收藏、自评、登录状态与题库筛选不以 Zustand 为真值源。
- **Rationale**: 规格已明确筛选走 URL、鉴权走 NextAuth、业务状态走数据库；这样可以避免多套状态源造成一致性问题。
- **Alternatives considered**:
  - 将收藏和自评状态完全放到客户端缓存：刷新后需要复杂同步，不适合 MVP。

## 决策 6：Markdown 内容使用 react-markdown 体系渲染
- **Decision**: `MarkdownRenderer` 使用 `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-raw` 实现题目正文和答案渲染。
- **Rationale**: 题目与答案包含 Markdown、代码块和表格，规格已明确所需能力；该组合能满足富文本展示需求。
- **Alternatives considered**:
  - MDX：能力更强，但内容编辑和安全边界更复杂。
  - 纯文本渲染：无法满足代码高亮和结构化内容展示。

## 决策 7：统计页以 Prisma 聚合 + 少量原生 SQL 完成
- **Decision**: 状态统计使用 Prisma `groupBy`，分类进度使用 `$queryRaw`，最近记录使用 `findMany`。
- **Rationale**: 规格已经给出推荐查询方式；该组合兼顾可维护性和统计表达能力。
- **Alternatives considered**:
  - 全部使用 Prisma 高级聚合：表达分类进度统计更绕。
  - 全部手写 SQL：灵活，但损失 Prisma 的模型约束与可读性。

## 决策 8：测试分层为单元 + 集成 + 页面关键流验证
- **Decision**: 表单校验、工具函数与状态映射做单元测试；Server Actions、鉴权与数据库交互做集成测试；关键用户流通过页面层验证补足。
- **Rationale**: 一期范围广但以业务闭环为核心，测试应优先覆盖登录、筛选、自评、收藏、统计等高价值路径。
- **Alternatives considered**:
  - 仅手工测试：回归风险高。
  - 全量端到端优先：前期搭建成本较高，不适合 MVP 首轮推进。

## 结论

当前规格中的技术上下文已被完全解析，不再存在 `NEEDS CLARIFICATION` 项。规划阶段后续文档将基于以上决策展开。