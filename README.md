# Uni-App-Store - 智能电商小程序系统

一个基于现代技术栈构建的跨平台电商小程序系统，采用事件驱动架构和智能 Agent 技术，提供完整的电商解决方案。

## 系统架构

### 整体架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Layer (ADK Framework)              │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Recommendation │   Shopping      │     Customer Service    │
│      Agent      │    Guide Agent  │         Agent           │
└─────────────────┴─────────────────┴─────────────────────────┘
                           │
                    Kafka Events
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API Gateway                       │
├─────────────────────────────────────────────────────────────┤
│              NestJS + Prisma + PostgreSQL                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────┬───────────────────────────────────┐
│     Frontend (小程序)    │        Admin Dashboard            │
│   uni-app + Vue 3       │      (管理端)                      │
└─────────────────────────┴───────────────────────────────────┘
```

### 架构优势

职责分离明确：Agent 专注智能决策，Backend 处理业务逻辑，前端负责用户交互  
事件驱动设计：基于 Kafka 的异步事件处理，支持高并发和扩展  
微服务友好：各层可独立部署、扩展和维护  
技术栈现代化：采用业界主流技术，生态成熟  

## 项目结构

```
uni-app-store/
├── store-test-backend/          # 后端 API 服务
│   ├── src/
│   │   ├── modules/            # 业务模块
│   │   │   ├── auth/          # 用户认证
│   │   │   ├── product/       # 商品管理
│   │   │   ├── cart/          # 购物车
│   │   │   ├── order/         # 订单管理
│   │   │   └── address/       # 地址管理
│   │   ├── common/            # 通用组件
│   │   └── prisma/            # 数据库服务
│   └── prisma/
│       └── schema.prisma      # 数据模型定义
│
├── store-test-web/             # 小程序前端
│   ├── src/
│   │   ├── pages/             # 页面组件
│   │   ├── api/               # 接口封装
│   │   ├── store/             # 状态管理
│   │   └── utils/             # 工具函数
│   └── pages.json             # 路由配置
│
├── store-test-agent/           # Agent 服务 (待开发)
│   └── recommendation/        # 推荐 Agent
│   └── shopping-guide/        # 导购 Agent
│   └── customer-service/      # 客服 Agent
│
└── store-test-admin/           # 管理后台 (待开发)
    └── src/
        ├── dashboard/         # 数据看板
        ├── product-mgmt/      # 商品管理
        └── order-mgmt/        # 订单管理
```

## 技术栈

### 后端服务 (store-test-backend)

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 运行时 | Node.js | 18+ | JavaScript 运行时 |
| 框架 | NestJS | 11.0 | 企业级 Node.js 框架 |
| 语言 | TypeScript | 5.7 | 类型安全的 JavaScript |
| 数据库 | PostgreSQL | 14+ | 主数据库 |
| ORM | Prisma | 7.4 | 现代化数据库工具 |
| 认证 | JWT | - | 双 token 机制 |
| 缓存 | Redis | - | 会话和缓存存储 |

### 前端小程序 (store-test-web)

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | uni-app | 3.0 | 跨平台开发框架 |
| 视图层 | Vue | 3.4 | 渐进式 JavaScript 框架 |
| 构建工具 | Vite | 5.2 | 快速构建工具 |
| 状态管理 | Vue 3 Reactive | - | 轻量级状态管理 |
| UI 组件 | uni-ui | 1.5 | 官方 UI 组件库 |

### Agent 服务 (规划中)

| 组件 | 技术 | 说明 |
|------|------|------|
| 框架 | ADK Framework | Agent 开发框架 |
| 消息队列 | Apache Kafka | 事件驱动架构 |
| 推荐算法 | 协同过滤 + 深度学习 | 个性化推荐 |
| NLP | Transformer 模型 | 自然语言处理 |

## 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6.0
- pnpm (推荐) 或 npm

### 1. 克隆项目

```bash
git clone <repository-url>
cd uni-app-store
```

### 2. 启动后端服务

```bash
cd store-test-backend

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接

# 数据库初始化
pnpm run prisma:generate
pnpm run prisma:migrate
pnpm run prisma:seed

# 启动开发服务器
pnpm run start:dev
```

后端服务将运行在 `http://localhost:3000`

### 3. 启动前端小程序

```bash
cd store-test-web

# 安装依赖
pnpm install

# H5 开发模式
pnpm run dev:h5
# 访问 http://localhost:5173

# 微信小程序开发模式
pnpm run dev:mp-weixin
# 使用微信开发者工具导入 dist/dev/mp-weixin 目录
```

## 数据模型

系统包含 9 个核心数据模型：

```
User ──┬── Address
       ├── CartItem ─── Product ─── Category
       ├── Order ────── OrderItem
       └── ChatSession ─── ChatMessage
```

### 订单状态流转

```
pending（待付款）
    │
    ├─→ paid（已付款）
    │      │
    │      └─→ shipped（已发货）
    │             │
    │             └─→ completed（已完成）
    │
    └─→ cancelled（已取消）
```

## 核心功能

### 用户端功能

- **用户认证**：手机号注册/登录，JWT 双 token 机制
- **商品浏览**：分类展示、搜索筛选、商品详情
- **购物车**：商品添加、数量修改、批量操作
- **订单管理**：下单流程、支付集成、物流跟踪
- **地址管理**：收货地址增删改查、默认地址设置
- **个人中心**：用户资料、订单历史、设置选项

### Agent 智能服务 (规划)

- **智能推荐**：基于用户行为的个性化商品推荐
- **导购助手**：智能对话式购物引导
- **客服机器人**：7x24 小时自动客服支持

### 管理端功能 (规划)

- **商品管理**：商品上架、库存管理、价格调整
- **订单管理**：订单处理、发货管理、售后服务
- **用户管理**：用户信息、行为分析、标签管理
- **数据看板**：销售统计、用户分析、运营指标

## API 接口

所有接口遵循统一响应格式：

```json
{
  "code": 0,
  "data": { ... },
  "message": "success"
}
```

### 主要接口模块

| 模块 | 路径 | 说明 |
|------|------|------|
| 认证 | `/auth` | 注册、登录、token 刷新 |
| 商品 | `/products` | 商品列表、详情、分类 |
| 购物车 | `/cart` | 购物车 CRUD 操作 |
| 订单 | `/orders` | 订单全生命周期管理 |
| 地址 | `/addresses` | 收货地址管理 |

详细接口文档请参考 [store-test-backend/README.md](./store-test-backend/README.md)

## 事件驱动架构

### Kafka 事件设计

```typescript
// 用户行为事件
interface UserEvent {
  type: 'USER_LOGIN' | 'USER_LOGOUT' | 'USER_REGISTER';
  userId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

// 商品事件
interface ProductEvent {
  type: 'PRODUCT_VIEW' | 'PRODUCT_ADD_TO_CART' | 'PRODUCT_PURCHASE';
  userId: string;
  productId: string;
  timestamp: Date;
}

// 订单事件
interface OrderEvent {
  type: 'ORDER_CREATED' | 'ORDER_PAID' | 'ORDER_SHIPPED' | 'ORDER_COMPLETED';
  orderId: string;
  userId: string;
  timestamp: Date;
}
```

### Agent 处理流程

```
用户行为 → Kafka Event → Agent 消费 → 智能处理 → 结果存储
    ↓           ↓           ↓          ↓         ↓
  浏览商品   → 生成事件   → 推荐 Agent → 计算推荐 → 更新推荐
  加入购物车 → 生成事件   → 导购 Agent → 生成建议 → 推送建议
  提交问询   → 生成事件   → 客服 Agent → NLP 处理 → 返回回复
```

## 性能优化

### 后端优化

- **数据库优化**：合理索引、查询优化、连接池管理
- **缓存策略**：Redis 缓存热点数据、会话管理
- **API 优化**：分页查询、字段选择、批量操作
- **并发处理**：事件驱动、异步处理、队列机制

### 前端优化

- **代码分割**：路由懒加载、组件按需加载
- **资源优化**：图片压缩、CDN 加速、缓存策略
- **交互优化**：骨架屏、预加载、虚拟滚动
- **包体积优化**：Tree Shaking、依赖分析

## 安全设计

### 认证授权

- **双 Token 机制**：Access Token (15min) + Refresh Token (7天)
- **密码安全**：bcrypt 哈希存储
- **权限控制**：基于角色的访问控制 (RBAC)

### 数据安全

- **输入验证**：class-validator 参数校验
- **SQL 注入防护**：Prisma ORM 自动防护
- **XSS 防护**：输入过滤、输出编码
- **CSRF 防护**：Token 验证

## 测试策略

### 后端测试

```bash
# 单元测试
pnpm run test

# 集成测试
pnpm run test:e2e

# 测试覆盖率
pnpm run test:cov
```

### 前端测试

- **组件测试**：Vue Test Utils
- **E2E 测试**：uni-app 自动化测试
- **兼容性测试**：多平台真机测试

## 部署方案

### 开发环境

```bash
# 使用 Docker Compose 一键启动
docker-compose up -d
```

### 生产环境

- **容器化部署**：Docker + Kubernetes
- **CI/CD 流程**：GitHub Actions / GitLab CI
- **监控告警**：Prometheus + Grafana
- **日志收集**：ELK Stack (Elasticsearch + Logstash + Kibana)

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- **ESLint**：代码风格检查
- **Prettier**：代码格式化
- **Husky**：Git hooks 自动化
- **Conventional Commits**：提交信息规范

## 许可证

本项目为私有项目，不对外分发。

## 致谢

感谢以下开源项目的支持：

- [NestJS](https://nestjs.com/) - 企业级 Node.js 框架
- [uni-app](https://uniapp.dcloud.io/) - 跨平台开发框架
- [Prisma](https://www.prisma.io/) - 现代化数据库工具
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架

---

**注意**：Agent 层和管理端目前处于规划阶段，欢迎贡献代码和提出建议！
