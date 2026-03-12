# Store Demo — Backend

本地部署服务器硬件商城的 REST API 服务，基于 NestJS 11 + Prisma 7 + PostgreSQL 构建。

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 运行时 | Node.js | 18+ |
| 框架 | NestJS | 11.0 |
| 语言 | TypeScript (ESM) | 5.7 |
| ORM | Prisma (`@prisma/adapter-pg`) | 7.4 |
| 数据库 | PostgreSQL | 14+ |
| 认证 | JWT (双 token 机制) | passport-jwt |
| 校验 | class-validator + class-transformer | — |
| 加密 | bcrypt | — |

## 项目结构

```
src/
├── main.ts                          # 启动入口 & CORS 配置
├── app.module.ts                    # 根模块（组装所有子模块）
│
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts # 全局异常过滤器 → { code, data, message }
│   ├── interceptors/
│   │   └── transform.interceptor.ts # 响应拦截器 → { code: 0, data, message: "success" }
│   ├── guards/
│   │   └── jwt-auth.guard.ts        # JWT 鉴权守卫
│   ├── decorators/
│   │   └── current-user.decorator.ts# @CurrentUser() 参数装饰器
│   └── dto/
│       └── pagination.dto.ts        # 通用分页 DTO
│
├── prisma/
│   ├── prisma.module.ts             # 全局 Prisma 模块
│   └── prisma.service.ts            # PrismaClient + PrismaPg 适配器
│
└── modules/
    ├── auth/                        # 注册、登录、token 刷新、个人资料
    ├── product/                     # 商品列表、详情、分类、推荐
    ├── cart/                        # 购物车增删改查（按用户隔离）
    ├── address/                     # 收货地址增删改查 + 设为默认
    └── order/                       # 订单全生命周期（创建→支付→发货→确认收货）
```

## 接口文档

所有响应遵循统一格式：

```json
{ "code": 0, "data": { ... }, "message": "success" }
```

异常响应 `code` 值为对应 HTTP 状态码。

### 认证模块 (`/auth`)

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/auth/register` | 否 | 手机号 + 密码注册 |
| POST | `/auth/login` | 否 | 登录 → 返回 access_token + refresh_token |
| POST | `/auth/refresh` | 否 | 刷新 access_token |
| GET | `/auth/profile` | JWT | 获取当前用户资料 |
| PUT | `/auth/profile` | JWT | 更新昵称 / 头像 |

### 商品模块 (`/products`)

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/products` | 否 | 商品列表（分页、分类、搜索、排序） |
| GET | `/products/featured` | 否 | 推荐商品（销量前 6） |
| GET | `/products/categories` | 否 | 全部分类 |
| GET | `/products/:id` | 否 | 商品详情 |

### 购物车模块 (`/cart`)

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/cart` | JWT | 获取购物车（含商品信息） |
| POST | `/cart` | JWT | 添加商品（productId, quantity） |
| PUT | `/cart/:id` | JWT | 修改数量 |
| DELETE | `/cart/:id` | JWT | 删除单项 |
| DELETE | `/cart` | JWT | 清空购物车 |

### 地址模块 (`/addresses`)

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET | `/addresses` | JWT | 地址列表 |
| POST | `/addresses` | JWT | 新增地址 |
| PUT | `/addresses/:id` | JWT | 编辑地址 |
| DELETE | `/addresses/:id` | JWT | 删除地址 |
| PUT | `/addresses/:id/default` | JWT | 设为默认 |

### 订单模块 (`/orders`)

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/orders` | JWT | 创建订单（商品列表 + 地址ID） |
| GET | `/orders` | JWT | 订单列表（分页、按状态筛选） |
| GET | `/orders/:id` | JWT | 订单详情 |
| PUT | `/orders/:id/cancel` | JWT | 取消订单（仅待付款状态） |
| POST | `/orders/:id/pay` | JWT | 模拟支付（pending → paid） |
| PUT | `/orders/:id/confirm` | JWT | 确认收货（shipped → completed） |

## 数据库设计

共 9 个数据模型，完整定义见 [`prisma/schema.prisma`](prisma/schema.prisma)。

```
User ──┬── Address
       ├── CartItem ─── Product ─── Category
       ├── Order ────── OrderItem
       └── ChatSession ─── ChatMessage
```

**订单状态流转：**

```
pending（待付款）→ paid（已付款）→ shipped（已发货）→ completed（已完成）
    │
    └──→ cancelled（已取消）
```

## 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL >= 14（本地运行）
- pnpm（推荐）或 npm

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，配置数据库连接：

```env
DATABASE_URL="postgresql://<用户名>@localhost:5432/store_demo?schema=public"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=3000
```

### 3. 创建数据库 & 执行迁移

```bash
createdb store_demo              # 或通过 psql / pgAdmin / Navicat 创建
pnpm run prisma:generate         # 生成 Prisma Client
pnpm run prisma:migrate          # 执行数据库迁移
```

### 4. 初始化种子数据

使用数据库工具（Navicat / pgAdmin / psql）打开并执行 [`prisma/seed_init.sql`](prisma/seed_init.sql)。

包含：
- 5 个商品分类（入门服务器、企业服务器、高性能计算、存储服务器、配件周边）
- 10 个服务器硬件商品（¥699 – ¥199,999）
- 1 个测试用户（手机号 `13800138000`，密码 `123456`）
- 2 个测试收货地址

### 5. 启动服务

```bash
# 开发模式（热重载）
pnpm run start:dev

# 生产模式
pnpm run build
pnpm run start:prod
```

默认运行在 `http://localhost:3000`。

### 快速验证

```bash
curl http://localhost:3000/api/products/featured
```

## 脚本一览

| 命令 | 说明 |
|------|------|
| `pnpm run start:dev` | 开发模式启动（watch） |
| `pnpm run build` | 编译 TypeScript 到 `dist/` |
| `pnpm run start:prod` | 运行编译后的代码 |
| `pnpm run prisma:generate` | 重新生成 Prisma Client |
| `pnpm run prisma:migrate` | 执行数据库迁移 |
| `pnpm run test` | 运行单元测试 |
| `pnpm run lint` | ESLint 检查 |

## 核心设计决策

- **Prisma 7 适配器模式**：使用 `@prisma/adapter-pg` 传入连接字符串，不在 `schema.prisma` 中配置 `url`，这是 Prisma 7 的 breaking change。
- **ESM 模块系统**：`package.json` 中 `"type": "module"`，所有相对导入使用 `.js` 后缀。
- **JWT 双 token**：access_token（15 分钟）+ refresh_token（7 天），密码使用 bcrypt 哈希。
- **订单快照机制**：创建订单时将地址和商品信息快照为 JSON 存储，确保商品/地址变更后历史订单数据不受影响。
- **库存事务管理**：下单时在 Prisma `$transaction` 中执行库存扣减和销量增加；取消订单时回滚库存。

## 许可证

私有项目，不对外分发。
