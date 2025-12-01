# MOOV AI 智能物流查询系统 Demo v2.0

一个现代化的物流AI查询系统Demo页面，为MOOV国际物流公司设计的AI智能查询助手。

## 🚀 功能特点

### 核心功能
- **智能意图识别**：自动识别PO单号查询、客户查询、目的地查询、状态查询
- **两种查询场景**：
  - 📦 **单订单查询**：详细展示货物信息、运输轨迹、文档状态
  - 📊 **批量查询**：展示订单列表、状态分布饼图、趋势柱状图
- **多轮对话支持**：AI主动引导后续问题，建议操作按钮
- **AI流式输出**：打字机效果，逐字显示回答

### 数据可视化
- 📈 状态分布饼图（Recharts）
- 📊 订单趋势柱状图
- 🛤️ 运输时间轴
- 📶 进度条动画
- 🎴 信息卡片网格

### 交互体验
- 流畅的Framer Motion动画
- 毛玻璃效果（Glassmorphism）
- 响应式设计，移动端友好
- 深色模式，上海夜景背景

## 🛠️ 技术栈

- **框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图表**: Recharts
- **Markdown渲染**: react-markdown
- **图标**: Lucide React

## 📦 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 🎯 使用示例

### 场景1：查询PO单号
```
输入：PO#12345
输入：12345
输入：查询订单12345的状态
```

### 场景2：客户批量查询
```
输入：Nike的所有订单
输入：查看Adidas的货物
```

### 场景3：目的地查询
```
输入：发往洛杉矶的货物
输入：纽约的订单
```

### 场景4：状态查询
```
输入：哪些订单延误了？
输入：延误的货物
```

## 📁 项目结构

```
src/
├── app/
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面
├── components/
│   ├── Header.tsx           # 顶部导航
│   ├── Hero.tsx             # 主查询区（整合组件）
│   ├── QueryInput.tsx       # 输入框组件
│   ├── AIResponse.tsx       # AI回答区域（多轮对话）
│   ├── LoadingAnimation.tsx # 加载动画
│   ├── ShipmentDetail.tsx   # 单订单详情（含时间轴）
│   ├── BatchQueryResult.tsx # 批量查询结果
│   ├── QuickExamples.tsx    # 快捷示例
│   ├── SuggestedActions.tsx # 建议操作按钮
│   └── charts/
│       ├── PieChart.tsx     # 状态饼图
│       └── BarChart.tsx     # 趋势柱状图
├── hooks/
│   └── useConversation.ts   # 对话状态管理
├── utils/
│   ├── mockData.ts          # 完整Mock数据
│   ├── intentDetection.ts   # 智能意图识别
│   └── typewriter.ts        # 打字机效果工具
└── styles/
    └── globals.css          # 全局样式
```

## 🎨 设计亮点

### 视觉风格
- 现代简约，科技感十足
- 深色模式 + 渐变色彩
- 毛玻璃效果（Glassmorphism）

### 配色方案
- 主色：深蓝 (#1e40af) + 科技蓝 (#3b82f6)
- 辅助色：蓝紫渐变 (#3b82f6 → #8b5cf6)
- 状态色：
  - 运输中：蓝色
  - 延误：橙色
  - 已到达：绿色
  - 待发货：灰色

### 动画效果
- 页面加载淡入
- 输入框聚焦发光
- AI打字机效果
- 数字滚动动画
- 图表展开动画
- 卡片悬浮效果

## 🔧 自定义配置

### 添加新的Mock订单
编辑 `src/utils/mockData.ts` 中的 `mockShipmentDetails` 对象

### 添加新的查询意图
编辑 `src/utils/intentDetection.ts` 中的 `detectQueryIntent` 函数

### 修改样式主题
- 颜色变量在 `tailwind.config.js`
- 全局样式在 `src/styles/globals.css`

## 📱 响应式断点

- **PC端 (>1024px)**: 完整布局，双列图表
- **平板端 (768-1024px)**: 单列图表
- **移动端 (<768px)**: 全宽显示，紧凑布局

## 📄 License

MIT License

---

Made with ❤️ for MOOV International Logistics
