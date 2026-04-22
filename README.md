# SharkNinja HRBP 智能问答平台

> 企业级 HR Business Partner 智能助手 — 基于 Azure GPT-5 + HR_Policy 知识库 + RBAC 权限体系

---

## 功能概览

| 模块 | 说明 |
|------|------|
| **JWT 鉴权** | HS256 签名 · httpOnly Cookie · 8h 会话 · iss/aud/jti 完整声明 |
| **RBAC 角色** | 管理员 / HRBP Manager / 普通员工 三级权限 |
| **Azure GPT-5** | 无 `temperature` 参数，`max_completion_tokens` 控制输出 |
| **RAG 检索** | `mammoth` 解析 HR_Policy DOCX → 关键词分块检索 → 注入 System Prompt |
| **6 个快速体验卡片** | 员工福利、请假制度、差旅报销、入职流程、离职手续、绩效评估（全 Mock 富媒体） |
| **FAB Agent** | 浮动 AI 聊天窗口，唯一真实调用 Azure OpenAI 的入口 |

---

## 技术栈

- **框架**: Next.js 16 (App Router + Turbopack)
- **语言**: TypeScript 5
- **UI 组件**: HeroUI v3 + Tailwind CSS v4
- **动画**: Framer Motion 12
- **图标**: Font Awesome 6
- **JWT**: `jose`（标准声明）
- **文档解析**: `mammoth`（DOCX → 纯文本）
- **AI**: Azure OpenAI GPT-5（无 temperature）
- **Markdown 渲染**: `react-markdown` + `remark-gfm`

---

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/guidoshar/HRBP-Knowledge-RAG-Agent.git
cd HRBP-Knowledge-RAG-Agent

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 Azure OpenAI 凭证 和 JWT_SECRET

# 4. 启动开发服务器
npm run dev

# 5. 构建生产版本
npm run build && npm start
```

---

## 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI 资源端点（不含末尾 `/`） | ✅ |
| `AZURE_OPENAI_API_KEY` | Azure API 密钥 | ✅ |
| `AZURE_OPENAI_DEPLOYMENT` | 部署名称，默认 `gpt-5` | ✅ |
| `AZURE_OPENAI_API_VERSION` | API 版本，默认 `2025-01-01-preview` | ✅ |
| `JWT_SECRET` | 至少 32 字符随机字符串，用于 JWT 签名 | ✅ |

> `.env.local` 已在 `.gitignore` 中，不会被提交到代码仓库。

---

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── auth/login/       # JWT 登录接口
│   │   ├── auth/logout/      # 登出接口
│   │   ├── auth/me/          # 当前用户接口
│   │   └── hr-chat/          # Azure GPT-5 RAG 问答接口
│   ├── login/                # 登录页
│   ├── layout.tsx            # 根布局（FABAgent 挂载点）
│   └── page.tsx              # 主仪表板
├── components/
│   ├── HRBPHeader.tsx        # 导航栏（含用户信息/退出）
│   ├── HeroSection.tsx       # 首屏搜索区
│   ├── QuickExperienceCards.tsx  # 6 个 HR 场景卡片
│   └── FABAgent.tsx          # 浮动 AI 聊天窗口
├── lib/
│   ├── auth.ts               # JWT 签发/验证 + RBAC mock 用户
│   └── hrKnowledge.ts        # DOCX 解析 + RAG 关键词检索
├── middleware.ts             # 路由守卫（JWT 验证）
├── styles/globals.css        # 全局样式 + Markdown 富文本样式
└── utils/
    └── hrMockData.ts         # 6 张卡片 Mock 富媒体内容
HR_policy/                    # HR 政策 DOCX 知识库文件
public/                       # Logo 等静态资源
```

---

## 安全说明

- API 密钥仅在服务端读取，**绝不暴露到前端**
- JWT 存储于 `httpOnly` Cookie，JavaScript 无法访问
- 所有非公开路由经 Next.js Middleware 强制 JWT 校验
- 生产环境请替换 `JWT_SECRET` 为随机强密码

---

## License

Apache-2.0 © 2026 SharkNinja
