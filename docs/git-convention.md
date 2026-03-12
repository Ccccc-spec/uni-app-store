# Git 提交规范

基于 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## 格式

```
<type>(<scope>): <subject>

[body]

[footer]
```

- **type**：必填，提交类型
- **scope**：可选，影响范围
- **subject**：必填，简短描述（不超过 72 字符，结尾不加句号）
- **body**：可选，详细说明（与 subject 空一行）
- **footer**：可选，关联 Issue 或标注破坏性变更

---

## Type 类型

| Type | 说明 | 示例场景 |
|------|------|----------|
| `feat` | 新功能 | 新增一个页面、接口、组件 |
| `fix` | Bug 修复 | 修复登录失败、接口报错 |
| `refactor` | 重构（不影响功能） | 提取公共逻辑、改写实现方式 |
| `style` | 代码格式（不影响逻辑） | 格式化、补分号、调整缩进 |
| `docs` | 文档 | 更新 README、补注释 |
| `test` | 测试 | 新增/修改单元测试、E2E 测试 |
| `chore` | 构建 / 依赖 / 工具 | 升级依赖、修改 vite 配置、调整 CI |
| `perf` | 性能优化 | 减少请求、优化渲染、缓存改进 |
| `revert` | 回滚提交 | 撤销某次错误提交 |
| `ci` | CI/CD 配置 | 修改 GitHub Actions workflow |
| `build` | 构建系统 | 修改 Dockerfile、docker-compose |

---

## Scope 范围（本项目）

| Scope | 对应目录 |
|-------|----------|
| `miniapp` | `apps/miniapp/` |
| `admin` | `apps/admin/` |
| `gateway` | `backend/api-gateway/` |
| `agent` | `agent-service/` |
| `sdk` | `packages/api-sdk/` |
| `utils` | `packages/utils/` |
| `config` | `packages/config/` |
| `infra` | `infra/` |
| `deps` | 依赖升级 |

---

## 示例

```bash
# 新功能
feat(miniapp): 新增商品搜索历史记录
feat(admin): 添加订单导出 Excel 功能
feat(gateway): 实现优惠券模块接口

# Bug 修复
fix(miniapp): 修复购物车数量更新后总价不刷新
fix(gateway): 修复刷新 token 并发竞争问题

# 重构
refactor(miniapp): 将 reactive store 迁移至 Pinia
refactor(gateway): 提取通用分页查询逻辑

# 依赖 / 构建
chore(deps): 升级 antd 至 5.21.0
chore(infra): 更新 docker-compose postgres 版本至 16

# 文档
docs: 补充 API 设计规范
docs(agent): 添加 LangGraph 工作流说明

# 破坏性变更（在 footer 注明）
feat(sdk): 重命名 ApiResponse 泛型字段

BREAKING CHANGE: ApiResponse.result 重命名为 ApiResponse.data，需同步更新所有调用方
```

---

## 分支命名

```
feat/<描述>        # 新功能，如 feat/cart-checkout
fix/<描述>         # Bug 修复，如 fix/login-token-refresh
refactor/<描述>    # 重构
chore/<描述>       # 杂项，如 chore/upgrade-antd
release/<版本>     # 发布，如 release/1.2.0
```

---

## 关联 Issue

```bash
fix(gateway): 修复订单状态更新接口 500 错误

Closes #42
```
