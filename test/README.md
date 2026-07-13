# 智阅图书后台管理系统 (book-admin)

一套面向图书馆 / 图书运营人员管理的**企业级中后台系统**，基于 React 18 + TypeScript + Vite 5 + Ant Design 5 构建。内置 `axios-mock-adapter` 本地数据兜底，可独立运行；关闭 Mock 后即通过 Vite 代理转发至真实后端，实现无缝对接。

## 功能特性

- **账号鉴权**：基于 Token 的登录 / 登出、路由守卫，未登录自动跳转登录页
- **动态权限菜单**：依据角色权限渲染侧边栏菜单，路由级权限校验（双重防护防越权）
- **数据看板 Dashboard**：图书 / 借阅 / 会员 / 分类统计卡片 + 借阅趋势面积图 + 分类分布环形图
- **图书管理**：列表展示、关键字搜索、分页、新增 / 编辑弹窗表单、删除、上下架状态
- **分类管理**：树形层级维护，增删改查 + 子分类保护
- **用户 / 会员管理**：会员列表、状态管理、搜索分页
- **借阅 / 借还管理**：借书登记、还书流程、借阅记录查询与状态流转
- **系统设置 / 角色权限**：角色列表 + 权限树勾选分配、系统参数设置

## 技术栈

| 分类 | 选型 |
| --- | --- |
| 构建 | Vite 5 + React 18 + TypeScript 5 |
| UI | Ant Design v5 + @ant-design/icons + lucide-react |
| 路由 | react-router-dom v6（路由守卫生成 + 动态权限菜单） |
| 状态 | Zustand（用户 / 权限 / 全局布局） |
| 请求 | Axios + 拦截器；axios-mock-adapter 本地兜底 |
| 图表 | Recharts（看板趋势 / 分布图） |
| 样式 | Tailwind CSS 3.4 + Ant Design 设计令牌 |

## 演示账号

系统内置两个账号，登录页直接输入即可体验不同权限：

| 账号 | 密码 | 角色 | 权限范围 |
| --- | --- | --- | --- |
| `admin` | `123456` | 超级管理员 | 全部权限 |
| `librarian` | `123456` | 图书管理员 | 看板 / 图书 / 分类 / 用户 / 借阅（不含系统设置） |

> 切换账号后，侧边菜单与可访问路由会按权限动态变化。

## 快速开始

> 要求 Node.js 18+ 与 npm。

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认开启 Mock）
npm run dev
# 打开 http://localhost:5173

# 3. 生产构建
npm run build
# 产物输出至 dist/

# 4. 本地预览构建产物
npm run preview
```

## 环境变量

Mock 与真实后端的切换完全由环境变量控制，无需改动业务代码。

`.env.development`（开发）：

```ini
VITE_API_BASE_URL=/api     # 请求基础路径（开发走 vite proxy 转发）
VITE_USE_MOCK=true         # true=使用本地模拟数据；false=请求真实后端
```

`.env.production`（生产）：

```ini
VITE_API_BASE_URL=/api
VITE_USE_MOCK=false
```

## 对接真实后端

1. 将 `.env.*` 中的 `VITE_USE_MOCK` 设为 `false`。
2. 真实接口需遵循统一响应信封：`{ code: 0, data: ..., message: '' }`（`code === 0` 视为成功）。
3. 分页接口返回 `{ list, total, page, pageSize }`。
4. 登录接口返回 `{ token, userInfo }`，其中 `userInfo.permissions` 为权限码数组；未登录 / Token 失效返回 HTTP 401，前端自动跳转登录页。
5. 后端地址可在 `vite.config.ts` 的 `server.proxy['/api']` 中修改（默认转发至 `http://localhost:8080`）。

## 目录结构

```
src/
├── api/            # 接口封装（user/book/category/borrow/dashboard）
├── components/     # 通用组件（PageContainer）
├── hooks/          # 复用 Hook（useTable 列表查询 / 分页 / 搜索）
├── layouts/        # 主框架 BasicLayout + SideMenu/HeaderBar/BreadcrumbNav
├── mock/           # 本地 Mock 数据（与 api 一一对应）
├── pages/          # 业务页面（Login/Dashboard/Books/Categories/Users/Borrows/Settings）
├── router/         # 路由元信息(routes.ts) + 路由表(index.tsx) + 守卫(guard.tsx)
├── stores/         # Zustand 状态（useAuthStore / useAppStore）
├── types/          # 全局类型定义（api/user/book/category/borrow）
├── utils/          # 请求封装(request) + Token 存储(auth)
├── App.tsx         # 路由出口 + 全局 Provider
└── main.tsx        # 应用入口（ConfigProvider + antd App + Mock 初始化）
```

## 权限码说明

菜单与路由权限由 `src/router/routes.ts` 单一数据源声明，新增页面只需在此处登记即可同时生成菜单与守卫。当前权限码：

```
dashboard:view           数据看板
book:view book:add book:edit book:delete     图书管理
category:view category:edit                   分类管理
user:view user:edit                          用户管理
borrow:view borrow:manage                     借阅管理
system:view system:role                       系统设置 / 角色权限
```

## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 生产构建（`tsc -b && vite build`） |
| `npm run preview` | 预览构建产物 |
| `npm run lint` | ESLint 检查（ts / tsx） |
| `npm run format` | Prettier 格式化 `src/**/*.{ts,tsx,css}` |

## 构建验证

- `npm run build` 已验证通过：5353 个模块成功转译，业务页按路由级 `React.lazy` 自动分包（如 `book-*.js`、`System-*.js`、`RolePermission-*.js` 等），首屏体积按需加载。
- 类型检查 `tsc -b` 通过（EXIT:0）。
- 请求层、Mock 层、路由守卫与动态菜单均已按企业级规范实现。
