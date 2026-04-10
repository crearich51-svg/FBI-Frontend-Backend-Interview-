# 前端面试通关平台环境变量

## 必填项

- `DATABASE_URL`: Prisma 运行时数据库连接，建议使用 Neon 提供的连接串。
- `DIRECT_URL`: Prisma 迁移/直连数据库使用的连接串。
- `NEXTAUTH_URL`: 当前环境的站点根地址。本地开发使用 `http://localhost:3000`。
- `NEXTAUTH_SECRET`: NextAuth JWT 加密密钥，请使用足够长的随机字符串。
- `GITHUB_CLIENT_ID`: GitHub OAuth 应用 Client ID。
- `GITHUB_CLIENT_SECRET`: GitHub OAuth 应用 Client Secret。

## 环境要求

- 本地、测试、生产环境都必须配置 GitHub OAuth。
- GitHub OAuth 回调地址需与部署环境域名保持一致。
- 不要把真实密钥提交到仓库；请将实际值写入 `.env.local`。
