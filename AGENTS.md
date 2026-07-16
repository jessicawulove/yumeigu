# AGENTS.md — YUMEIGU 智能体工具箱

## 项目概览

公司内部 AI 智能体管理平台，提供智能体广场浏览、对话交互、后台管理等功能。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19 + TypeScript 5
- **UI**: shadcn/ui + Tailwind CSS 4
- **数据存储**: localStorage 模拟

## 目录结构

```
src/
├── app/
│   ├── layout.tsx              # 全局布局
│   ├── page.tsx                # 智能体广场首页
│   ├── globals.css             # 全局样式 + CSS 变量
│   ├── chat/[id]/page.tsx      # 智能体对话页面
│   └── admin/page.tsx          # 管理后台
├── components/
│   ├── ui/                     # shadcn/ui 组件库
│   ├── Navbar.tsx              # 顶部导航栏
│   └── AgentCard.tsx           # 智能体卡片组件
└── lib/
    ├── types.ts                # 类型定义 + 分类常量
    ├── store.ts                # localStorage 数据层
    └── utils.ts                # 工具函数
```

## 核心页面

| 路由 | 功能 | 文件 |
|------|------|------|
| `/` | 智能体广场（分类筛选 + 卡片网格 + 搜索） | `src/app/page.tsx` |
| `/chat/[id]` | 智能体对话（多轮对话 + 历史记录） | `src/app/chat/[id]/page.tsx` |
| `/admin` | 管理后台（增删改查 + 上下架 + 数据统计） | `src/app/admin/page.tsx` |

## 数据层

- `src/lib/store.ts`：封装 localStorage 操作，提供 CRUD API
- 预设 10 个示例智能体，覆盖写作/营销/研发/运营/人事/财务/设计 7 个分类
- 对话记录按 agentId 独立存储

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm ts-check     # TypeScript 类型检查
pnpm lint         # ESLint 检查
```
