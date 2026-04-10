# 实施计划：前端面试通关平台一期 MVP

**Feature**: `20260409-frontend-interview-platform` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: 功能规格来自 `/specs/20260409-frontend-interview-platform/spec.md`

**Note**: 本文件由 `/adk-sdd-plan` 生成，用于承接 Phase 0 研究与 Phase 1 设计产物。

## 概述

一期 MVP 将基于 Next.js 14 App Router 构建一个前端面试刷题平台，覆盖注册登录、题库筛选、题目详情、渐进式答案、自评、收藏、Dashboard 与 Landing Page。技术方案采用 NextAuth v5 + Prisma + Neon PostgreSQL + TailwindCSS + Shadcn/ui，数据读取优先使用 Server Components，写操作通过 Server Actions 落库；筛选状态统一使用 URL search params，业务真值保存在数据库中。Phase 0 已产出 `research.md`，Phase 1 已产出 `data-model.md`、`contracts/*.openapi.yaml` 与 `quickstart.md`。

## 技术上下文

**Language/Version**: TypeScript 5.x，Next.js 14.x App Router
**Primary Dependencies**: NextAuth.js v5(beta)、Prisma 5.x、PostgreSQL(Neon)、TailwindCSS 4.x、Shadcn/ui、Radix UI、Zustand 4.x、react-markdown、remark-gfm、rehype-highlight、rehype-raw
**Storage**: Neon PostgreSQL（通过 Prisma 访问）
**Testing**: 单元测试（表单校验、工具函数、状态映射）+ 集成测试（Server Actions、鉴权、数据库交互）+ 关键页面流验证
**Target Platform**: Web（桌面端 + 移动端响应式），部署目标为 Vercel
**Project Type**: 单仓 Web 应用
**Performance Goals**: 首屏可完成服务端渲染；题库筛选与详情打开满足日常刷题场景的流畅交互；支持 150 道首批题目稳定浏览与统计
**Constraints**: GitHub OAuth 需在本地/测试/生产环境全部可用；筛选条件必须可分享与刷新恢复；移动端侧边栏改为抽屉；Session 使用 JWT；一期不实现 AI 追问、社区 UGC、简历解析等扩展能力
**Scale/Scope**: 一期覆盖 6 个核心用户故事、8 个题目分类、150 道种子题、登录用户的自评/收藏/统计闭环

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 检查项 | 结果 | 说明 |
| --- | --- | --- |
| 与现有代码风格保持一致 | 通过 | 当前项目尚未落地业务代码，计划将严格遵循规格中约定的目录与组件分层，并在实现阶段参考已有生成模板与仓库约定。 |
| 优先复用既有模式与组件 | 通过 | UI 体系统一采用 Shadcn/ui + Radix UI，避免在一期引入额外组件库。 |
| 知识检索与文档来源可追溯 | 通过 | 需求来自飞书文档，本阶段已在 `spec.md` 中保留原链接与本地副本引用。 |
| 规划阶段无未决关键澄清 | 通过 | `research.md` 已消化全部技术决策，当前无 `NEEDS CLARIFICATION`。 |
| 避免不必要复杂度 | 通过 | 采用单体 Web 架构、Server Components + Server Actions，未增加额外 BFF、消息队列或微服务拆分。 |

**Phase 0 复核**: 通过。`research.md` 已完成技术选型和关键方案定稿。
**Phase 1 复核**: 通过。`data-model.md`、`contracts/`、`quickstart.md` 与规格一致，未引入额外架构风险。

## Project Structure

### Documentation (this feature)

```text
specs/20260409-frontend-interview-platform/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── auth.openapi.yaml
│   ├── questions.openapi.yaml
│   └── progress.openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (main)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── questions/page.tsx
│   ├── questions/[id]/page.tsx
│   ├── favorites/page.tsx
│   └── profile/page.tsx
├── api/auth/[...nextauth]/route.ts
├── layout.tsx
├── page.tsx
└── globals.css

server/
├── auth.ts
├── db.ts
└── actions/
    ├── questions.ts
    ├── answers.ts
    └── favorites.ts

components/
├── ui/
├── layout/
├── questions/
├── auth/
└── shared/

lib/
├── utils.ts
├── constants.ts
└── validations.ts

prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

**Structure Decision**: 采用单仓 Next.js Web 应用结构，在仓库根目录直接放置 `app/`、`server/`、`components/`、`lib/`、`prisma/` 等目录。鉴权、题库、收藏、统计共享同一部署单元，以降低一期实现复杂度并匹配 Vercel + Prisma 的部署模型。

## Complexity Tracking

当前无需登记额外复杂度豁免项。实现方案保持单体、关系型数据库、服务端渲染优先与最小必要状态管理，未违反现有治理约束。