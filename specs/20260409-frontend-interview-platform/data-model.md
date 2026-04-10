# 数据模型：前端面试通关平台一期 MVP

## 1. 实体概览

| 实体 | 说明 | 关键关系 |
| --- | --- | --- |
| User | 平台用户 | 1:N Account / Session / UserAnswer / UserFavorite |
| Account | 第三方登录账号 | N:1 User |
| Session | 登录会话 | N:1 User |
| VerificationToken | 鉴权验证令牌 | 独立使用 |
| Question | 题库题目 | 1:N QuestionTag / UserAnswer / UserFavorite |
| QuestionTag | 题目标签 | N:1 Question |
| UserAnswer | 用户答题状态 | N:1 User, N:1 Question |
| UserFavorite | 用户收藏关系 | N:1 User, N:1 Question |

## 2. 实体字段与约束

### 2.1 User
- `id: String`，主键，`cuid()`
- `name: String?`
- `email: String`，唯一
- `emailVerified: DateTime?`
- `image: String?`
- `passwordHash: String?`，邮箱注册用户必填，OAuth 用户可为空
- `createdAt / updatedAt`

**校验规则**
- 注册时 `name` 长度 2-50
- `email` 必须合法且全局唯一
- `password` 原文不入库，仅保存哈希值

### 2.2 Account
- `id: String`
- `userId: String`
- `type / provider / providerAccountId`
- `refresh_token / access_token / expires_at / token_type / scope / id_token / session_state`

**约束**
- `@@unique([provider, providerAccountId])`
- 删除用户时级联删除账号绑定

### 2.3 Session
- `id: String`
- `sessionToken: String`，唯一
- `userId: String`
- `expires: DateTime`

### 2.4 VerificationToken
- `identifier: String`
- `token: String`，唯一
- `expires: DateTime`
- `@@unique([identifier, token])`

### 2.5 Question
- `id: String`
- `title: String`
- `content: Text`
- `answerHint: Text?`
- `answer: Text`
- `deepKnowledge: Text?`
- `category: Category`
- `subCategory: String`
- `difficulty: Difficulty`
- `sortOrder: Int = 0`
- `createdAt / updatedAt`

**约束与索引**
- `@@index([category])`
- `@@index([difficulty])`
- `@@index([category, difficulty])`
- 题目详情至少必须有 `title/content/answer/category/subCategory/difficulty`

### 2.6 QuestionTag
- `id: String`
- `name: String`
- `questionId: String`

**约束与索引**
- `@@index([name])`
- `@@index([questionId])`

### 2.7 UserAnswer
- `id: String`
- `userId: String`
- `questionId: String`
- `status: AnswerStatus`
- `createdAt / updatedAt`

**约束与业务规则**
- `@@unique([userId, questionId])`
- 每位用户每道题只有一条答题状态记录，重复提交使用 upsert 覆盖
- 允许状态在 `MASTERED / FUZZY / UNKNOWN` 间切换

### 2.8 UserFavorite
- `id: String`
- `userId: String`
- `questionId: String`
- `createdAt: DateTime`

**约束与业务规则**
- `@@unique([userId, questionId])`
- 同一用户不能重复收藏同一道题

## 3. 枚举定义

### 3.1 Category
- `HTML_CSS`
- `JAVASCRIPT`
- `BROWSER`
- `NETWORK`
- `FRAMEWORK`
- `ENGINEERING`
- `TYPESCRIPT`
- `NEW_TECH`

### 3.2 Difficulty
- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`
- `EXPERT`

### 3.3 AnswerStatus
- `MASTERED`
- `FUZZY`
- `UNKNOWN`

## 4. 状态迁移

### 4.1 用户鉴权状态
- 未登录 → 注册成功/登录成功 → 已登录
- 已登录 → 点击登出 → 未登录

### 4.2 答题状态
- 无记录 → `MASTERED`
- 无记录 → `FUZZY`
- 无记录 → `UNKNOWN`
- `MASTERED` ↔ `FUZZY` ↔ `UNKNOWN`

### 4.3 收藏状态
- 未收藏 → 收藏
- 已收藏 → 取消收藏

## 5. 读写模式

| 场景 | 读模型 | 写模型 |
| --- | --- | --- |
| 登录/注册 | User / Account / Session | User / Account / Session |
| 题库列表 | Question + QuestionTag + UserAnswer + UserFavorite | 无 |
| 题目详情 | Question + QuestionTag + UserAnswer + UserFavorite | UserAnswer / UserFavorite |
| Dashboard | UserAnswer + Question | UserAnswer |
| 收藏列表 | UserFavorite + Question | UserFavorite |

## 6. 种子数据要求
- 首批共 150 题
- 每题必须包含标题、正文、参考答案、一级分类、二级分类、难度、标签数组
- `answerHint` 建议 1-3 句话
- `deepKnowledge` 可选但建议覆盖高频题
- 分类数量分布遵循规格说明中的目标配额