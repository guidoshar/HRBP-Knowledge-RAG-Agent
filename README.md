# SharkNinja HRBP 智能问答平台

> 基于 Microsoft 企业生态的新一代 HR Business Partner 智能助手

[![Azure Entra ID](https://img.shields.io/badge/Azure%20Entra%20ID-SSO-0078D4?logo=microsoftazure)](https://learn.microsoft.com/en-us/entra/identity/)
[![Azure AI Foundry](https://img.shields.io/badge/Azure%20AI%20Foundry-GPT--5-0078D4?logo=microsoftazure)](https://ai.azure.com/)
[![Azure AI Search](https://img.shields.io/badge/Azure%20AI%20Search-Vector%20RAG-0078D4?logo=microsoftazure)](https://azure.microsoft.com/en-us/products/ai-services/ai-search/)
[![SharePoint](https://img.shields.io/badge/SharePoint-Knowledge%20Base-0078D4?logo=microsoftsharepoint)](https://www.microsoft.com/en-us/microsoft-365/sharepoint/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)

---

## 架构概览

```
┌─────────────────────────────────────────────────────┐
│                 SharkNinja 企业网络                   │
│                                                     │
│  员工浏览器                                           │
│     │                                               │
│     ▼                                               │
│  ┌──────────────┐     ┌──────────────────────────┐  │
│  │  Next.js 16  │────▶│  Azure Entra ID (SSO)    │  │
│  │  HRBP 平台   │     │  · OIDC / OAuth 2.0      │  │
│  │              │     │  · RBAC 角色同步           │  │
│  │              │     │  · 条件访问策略             │  │
│  └──────┬───────┘     └──────────────────────────┘  │
│         │                                           │
│         ▼                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │           Azure AI Foundry                   │   │
│  │  · GPT-5 模型部署与编排                        │   │
│  │  · Prompt Flow 工作流管理                      │   │
│  │  · 安全内容过滤 (Content Filter)               │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                               │
│         ┌───────────┘                               │
│         ▼                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │           Azure AI Search                    │   │
│  │  · 向量检索 (Vector Search)                   │   │
│  │  · 语义排名 (Semantic Ranker)                  │   │
│  │  · 混合检索 (Hybrid Search)                   │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                               │
│         ┌───────────┘                               │
│         ▼                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │     SharePoint Online / HR_Policy 文档库      │   │
│  │  · HR 政策文档自动索引                          │   │
│  │  · 基于 Entra ID 的文档级 RBAC 控制            │   │
│  │  · 版本管理与审计日志                           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 核心功能

| 模块 | 技术 | 说明 |
|------|------|------|
| **统一身份认证** | Azure Entra ID | OIDC/OAuth 2.0 SSO · 条件访问 · MFA |
| **RBAC 权限体系** | Entra ID + SharePoint | 管理员 / HRBP Manager / 普通员工 · 文档级访问控制 |
| **AI 模型编排** | Azure AI Foundry | GPT-5 部署管理 · Prompt Flow · 内容安全过滤 |
| **知识库检索** | Azure AI Search | 向量检索 + 语义排名 + 混合检索 · SharePoint 自动索引 |
| **文档管理** | SharePoint Online | HR_Policy 文档库 · 版本控制 · 审计日志 |
| **智能问答** | GPT-5 + RAG | 基于 HR 政策文档的精准问答，拒绝编造 |
| **快速体验卡片** | Mock / 演示 | 6 个常见 HR 场景预览（福利、请假、差旅、入职、离职、绩效） |
| **FAB Agent** | 实时对话 | 浮动 AI 聊天窗口，多轮对话，Markdown 富文本输出 |

---

## 技术栈

### 后端 / 云服务

| 服务 | 用途 |
|------|------|
| **Azure Entra ID** | SSO 统一登录 · RBAC 角色同步 · 条件访问策略 |
| **Azure AI Foundry** | GPT-5 模型编排 · Prompt Flow · 部署管理 |
| **Azure AI Search** | HR 知识库向量索引 · 语义检索 · 混合排名 |
| **SharePoint Online** | HR_Policy 文档库 · 自动索引触发器 |
| **Microsoft Graph API** | 用户档案 · 组织结构 · 权限查询 |

### 前端应用

| 技术 | 版本 | 说明 |
|------|------|------|
| **Next.js** | 16 | App Router · Turbopack · Middleware SSO Guard |
| **TypeScript** | 5 | 全量类型安全 |
| **HeroUI** | v3 | 企业级 UI 组件库 |
| **Tailwind CSS** | v4 | 原子化 CSS · CSS-first 配置 |
| **Framer Motion** | 12 | 流畅动画 |
| **Font Awesome** | 6 | 图标库 |
| **react-markdown** | 10 | Markdown 富文本渲染（含表格） |

---

## 快速开始（本地开发）

```bash
# 1. 克隆仓库
git clone https://github.com/guidoshar/HRBP-Knowledge-RAG-Agent.git
cd HRBP-Knowledge-RAG-Agent

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 Azure 服务凭证

# 4. 启动开发服务器
npm run dev

# 5. 生产构建
npm run build && npm start
```

---

## 环境变量

| 变量名 | 说明 | 对应服务 |
|--------|------|----------|
| `AZURE_OPENAI_ENDPOINT` | Azure AI Foundry 端点 URL | Azure AI Foundry |
| `AZURE_OPENAI_API_KEY` | API 访问密钥 | Azure AI Foundry |
| `AZURE_OPENAI_DEPLOYMENT` | 模型部署名称（如 `gpt-5`） | Azure AI Foundry |
| `AZURE_OPENAI_API_VERSION` | API 版本（如 `2025-01-01-preview`） | Azure AI Foundry |
| `JWT_SECRET` | 本地开发 JWT 签名密钥（≥32字符） | 本地鉴权 |

> **生产环境**：使用 Azure Entra ID OIDC 替换 JWT，通过 `@azure/msal-node` 接入 SSO，无需 `JWT_SECRET`。

---

## 生产部署路径（Road to Production）

```
现状（Demo）                    生产目标
─────────────────────           ──────────────────────────────
Mock JWT 鉴权          ──▶     Azure Entra ID OIDC / MSAL
本地 DOCX 关键词检索    ──▶     Azure AI Search 向量 + 语义检索
本地文件知识库          ──▶     SharePoint Online 文档库自动索引
直连 Azure OpenAI      ──▶     Azure AI Foundry Prompt Flow 编排
硬编码 RBAC            ──▶     Entra ID 安全组 + SharePoint 权限继承
```

---

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── auth/login/           # 本地 JWT 登录（Demo）
│   │   ├── auth/logout/          # 登出
│   │   ├── auth/me/              # 当前用户信息
│   │   └── hr-chat/              # Azure AI Foundry RAG 问答
│   ├── login/                    # 登录页（Entra ID SSO 入口）
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主仪表板
├── components/
│   ├── HRBPHeader.tsx            # 导航（用户信息 / 退出）
│   ├── HeroSection.tsx           # 首屏智能搜索
│   ├── QuickExperienceCards.tsx  # 6 个 HR 场景卡片
│   └── FABAgent.tsx              # 浮动 AI 聊天窗口
├── lib/
│   ├── auth.ts                   # JWT 签发/验证（Demo 阶段）
│   └── hrKnowledge.ts            # RAG 检索（→ Azure AI Search）
├── middleware.ts                 # 路由守卫（→ Entra ID 中间件）
├── styles/globals.css            # 全局样式 + 富文本 Markdown
└── utils/
    └── hrMockData.ts             # Mock 演示数据
HR_policy/                        # HR 政策文档（→ SharePoint 索引源）
public/                           # 静态资源（Logo 等）
```

---

## 安全说明

- **API 密钥**：仅在服务端 `process.env` 读取，不暴露到前端
- **Cookie**：`httpOnly: true` · `sameSite: lax` · 生产启用 `secure: true`
- **RBAC**：生产环境通过 Entra ID 安全组控制，不依赖前端逻辑
- **内容安全**：Azure AI Foundry 内置 Content Filter，防止有害输出
- **审计**：SharePoint 文档操作 + Azure Monitor 全链路日志

---

## License

Apache-2.0 © 2026 SharkNinja
