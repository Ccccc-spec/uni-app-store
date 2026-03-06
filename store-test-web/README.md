# Store Demo — Frontend

本地部署服务器硬件商城的跨平台小程序前端，基于 uni-app 3.0 + Vue 3 构建。

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | uni-app | 3.0 |
| 视图层 | Vue | 3.4 |
| 图标库 | @dcloudio/uni-ui | 1.5 |
| 构建工具 | Vite | 5.2 |
| 状态管理 | Vue 3 `reactive()`（无 Vuex/Pinia） |
| HTTP | 基于 `uni.request` 的统一封装 |
| 支持平台 | H5、微信小程序、支付宝小程序等 |

## 项目结构

```
src/
├── App.vue                     # 全局生命周期（登录态恢复、购物车加载）
├── main.js                     # Vue 应用初始化
├── pages.json                  # 路由配置、TabBar（4 个标签页）、easycom
├── manifest.json               # 应用元信息 & 平台配置
│
├── api/                        # 后端接口层
│   ├── auth.js                 # 登录、注册、个人资料
│   ├── product.js              # 商品、分类、推荐
│   ├── cart.js                 # 购物车增删改查
│   ├── order.js                # 订单全流程
│   └── address.js              # 收货地址增删改查
│
├── store/                      # 响应式状态管理（Vue 3 reactive）
│   ├── auth.js                 # 用户会话、token 持久化
│   ├── cart.js                 # 购物车、结算快照
│   ├── order.js                # 订单列表、状态常量
│   └── address.js              # 地址列表、选中状态
│
├── utils/
│   └── request.js              # HTTP 客户端（自动注入 token、401 跳转）
│
├── pages/
│   ├── home/index.vue          # 首页：沉浸式轮播 + 分类导航 + 商品大图
│   ├── search/index.vue        # 搜索：热门标签 + 两列商品网格
│   ├── detail/index.vue        # 商品详情：规格参数、加购、立即购买
│   ├── cart/index.vue          # 购物车：数量控制、结算
│   ├── my/index.vue            # 个人中心：订单入口、功能菜单
│   ├── login/index.vue         # 登录：手机号 + 密码，登录/注册切换
│   ├── address/index.vue       # 地址列表（支持结算时选择模式）
│   ├── address/edit.vue        # 新增/编辑地址表单
│   ├── order/confirm.vue       # 确认订单 + 模拟微信支付
│   ├── order/index.vue         # 订单列表：5 个状态 Tab 筛选
│   ├── order/detail.vue        # 订单详情：状态、地址、商品、金额
│   └── settings/index.vue      # 设置：清除缓存、关于、退出登录
│
└── static/
    └── tab/                    # TabBar 图标（home、search、cart、my）
```

## 页面与导航

### TabBar（4 个标签页）

| 标签 | 页面 | 说明 |
|------|------|------|
| Home | `pages/home/index` | 轮播推荐、分类导航、商品卡片 |
| Search | `pages/search/index` | 关键词搜索、热门标签、网格结果 |
| Cart | `pages/cart/index` | 购物车列表、数量加减、去结算 |
| Profile | `pages/my/index` | 用户信息、订单快捷入口、功能菜单 |

### 完整用户流程

```
首页 ──→ 商品详情 ──→ 加入购物车 ──→ 购物车 ──→ 结算
            │                                     │
            └── 立即购买 ────────────────────────┘
                                                  │
                                        确认订单 ──→ 模拟微信支付
                                                  │
                                        订单详情 / 订单列表
```

### 登录流程

```
任意需登录操作 ──→ 是否已登录？
      │                  │
      已登录 → 继续    未登录 → 跳转登录页
                               │
                       登录成功 → 自动跳转 Profile 页
```

## 接口对接

所有 API 调用通过 `src/utils/request.js` 统一处理：

- **接口地址**：`http://localhost:3000/api`
- **鉴权方式**：自动从 `uni.getStorageSync` 读取 token，注入 `Authorization: Bearer` 请求头
- **响应格式**：`{ code: 0, data, message }`，封装层自动提取 `data` 返回
- **401 处理**：自动清除 token 并跳转到登录页

## 状态管理

不依赖外部库，使用 Vue 3 `reactive()` 实现轻量级全局状态：

| Store 文件 | 职责 |
|-----------|------|
| `auth.js` | 登录/登出、token 通过 `uni.setStorageSync` 持久化、用户资料 |
| `cart.js` | 购物车 CRUD（调用后端 API）、`checkoutItems` 结算快照 |
| `order.js` | 订单 CRUD、状态常量（`pending`/`paid`/`shipped`/`completed`/`cancelled`） |
| `address.js` | 地址 CRUD、`selectedId` 用于结算页地址选择 |

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm（推荐）或 npm
- 后端服务运行在 `http://localhost:3000`（见 [store-test-backend](../store-test-backend)）

### 1. 安装依赖

```bash
pnpm install
```

### 2. H5 开发模式

```bash
pnpm run dev:h5
```

浏览器打开 `http://localhost:5173`。

### 3. 微信小程序

```bash
pnpm run dev:mp-weixin
```

用「微信开发者工具」导入 `dist/dev/mp-weixin` 目录。

### 4. 生产构建

```bash
pnpm run build:h5             # H5
pnpm run build:mp-weixin      # 微信小程序
```

## 脚本一览

| 命令 | 说明 |
|------|------|
| `pnpm run dev:h5` | H5 开发服务器（支持热更新） |
| `pnpm run dev:mp-weixin` | 微信小程序开发构建 |
| `pnpm run build:h5` | H5 生产构建 |
| `pnpm run build:mp-weixin` | 微信小程序生产构建 |

## 设计规范

| 属性 | 值 |
|------|------|
| 主色 | `#ff6b35` |
| 辅色 | `#ffa54f` |
| 深色背景 | `#000` / `#111` |
| 浅色背景 | `#f5f5f5` |
| 主文字色 | `#333` |
| 次文字色 | `#666` / `#999` |
| 图标方案 | `@dcloudio/uni-ui` 的 `uni-icons` 组件 |
| 尺寸单位 | `rpx`（响应式像素，750rpx = 屏幕宽度） |
| TabBar | 深色主题（`#111` 底色，选中白色） |

## 核心设计决策

- **无 mock 数据**：所有数据来自后端 API，无本地模拟层。
- **uni-icons 替代 emoji**：全部图标使用 `@dcloudio/uni-ui` 的 `<uni-icons>` 组件，通过 easycom 自动导入，代码中零 emoji。
- **reactive 替代 Vuex/Pinia**：使用 `reactive()` 对象管理状态，对小型应用更轻量，无额外依赖。
- **结算快照模式**：结算前将购物车商品快照到 `checkoutItems`，同时支持「加入购物车→结算」和「立即购买」两种下单路径。
- **模拟微信支付**：当前使用 `uni.showModal` 模拟支付流程，后端提供 prepay_id 后可无缝切换为真实 `wx.requestPayment`。

## 许可证

私有项目，不对外分发。
