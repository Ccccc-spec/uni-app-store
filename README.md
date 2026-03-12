# Uni-App-Store — 企业级电商 Monorepo

基于 pnpm workspaces 的企业级跨平台电商系统，包含小程序、管理后台、API 网关和 AI Agent 服务。

## 项目结构

```
uni-app-store/
├── apps/
│   ├── miniapp/          # 微信小程序 (uni-app + Vue 3 + Pinia + uview-plus)
│   └── admin/            # 管理后台 (React 18 + Ant Design 5 + Zustand)
├── backend/
│   ├── api-gateway/      # 主 API 服务 (NestJS + Prisma + PostgreSQL) :3000
│   ├── user-service/     # 用户微服务骨架 :3001
│   ├── product-service/  # 商品微服务骨架 :3002
│   ├── order-service/    # 订单微服务骨架 :3003
│   └── payment-service/  # 支付微服务骨架 :3004
├── agent-service/        # AI Agent 服务 (Python + FastAPI + LangGraph) :8000
├── packages/
│   ├── api-sdk/          # 共享 TypeScript 类型定义
│   ├── config/           # 共享常量与环境配置
│   ├── utils/            # 共享工具函数 (format, validators)
│   └── ui/               # 共享 UI 组件 (占位)
├── infra/
│   ├── docker/           # Docker Compose 配置
│   ├── ci/               # CI 配置副本
│   └── k8s/              # Kubernetes 配置 (待补充)
├── docs/
│   ├── architecture.md   # 架构文档
│   └── api-design.md     # API 设计规范
├── .github/workflows/    # GitHub Actions CI/CD
├── pnpm-workspace.yaml   # pnpm monorepo 配置
├── package.json          # 根 package（workspace 脚本）
├── tsconfig.json         # 基础 TypeScript 配置
└── .env.example          # 环境变量模板
```

## 架构概览

```
┌──────────────┐  ┌──────────────┐
│   Mini App   │  │ Admin (SPA)  │
│  (uni-app)   │  │  React/AntD  │
└──────┬───────┘  └──────┬───────┘
       └────────┬─────────┘
                ▼
   ┌────────────────────────┐
   │    API Gateway :3000   │
   │  NestJS + Prisma + JWT │
   │  Swagger: /api/docs    │
   └─────┬──────────────────┘
         │
  ┌──────┼──────┐
  ▼      ▼      ▼
Postgres Redis  Agent Service
:5432   :6379   FastAPI :8000
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 16
- Python >= 3.11（agent-service）

### 1. 安装依赖

```bash
# 复制环境变量
cp .env.example .env
# 编辑 .env 配置数据库等

# 安装所有 workspace 依赖
pnpm install
```

### 2. 启动各服务

```bash
# API Gateway (NestJS)
pnpm dev:gateway          # http://localhost:3000
                          # Swagger: http://localhost:3000/api/docs

# Admin 后台
pnpm dev:admin            # http://localhost:5173

# 小程序（微信）
pnpm dev:miniapp          # 输出到 dist/dev/mp-weixin

# Agent 服务
cd agent-service
pip install -r requirements.txt
python main.py            # http://localhost:8000
```

### 3. Docker 一键启动

```bash
cd infra/docker
docker-compose up -d
```

### 4. 数据库初始化

```bash
pnpm db:migrate           # Prisma migrate dev
```

### 5. 构建共享包

```bash
pnpm sdk:build            # 构建 @uni-app-store/api-sdk
```

## 技术栈

| 模块 | 技术 |
|------|------|
| 小程序 | uni-app 3, Vue 3, TypeScript, Pinia, uview-plus |
| Admin | React 18, Ant Design 5, Zustand, React Query, Vite |
| API Gateway | NestJS 11, Prisma 7, PostgreSQL 16, JWT |
| Agent | Python 3.12, FastAPI, LangGraph, LangChain, OpenAI |
| 包管理 | pnpm workspaces |
| CI/CD | GitHub Actions |
| 容器 | Docker Compose |

## 工作区脚本

```bash
pnpm dev:miniapp     # 启动小程序开发（微信）
pnpm dev:admin       # 启动 Admin 后台
pnpm dev:gateway     # 启动 API Gateway
pnpm build:admin     # 构建 Admin
pnpm db:migrate      # 数据库迁移
pnpm sdk:build       # 构建 api-sdk
pnpm test            # 运行所有测试
```

## 文档

- [架构文档](./docs/architecture.md)
- [API 设计规范](./docs/api-design.md)
- [Git 提交规范](./docs/git-convention.md)
- [API Swagger](http://localhost:3000/api/docs)（运行时访问）

## 许可证

私有项目，不对外分发。
