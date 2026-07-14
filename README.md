# 智阅图书后台管理系统 (book-admin)

一套面向图书馆 / 图书运营人员的**企业级中后台系统**。本仓库为前后端单体仓库（monorepo）：

- `test/` —— 前端：React 18 + TypeScript + Vite 5 + Ant Design 5
- `testBack/` —— 后端：Java 17 + Spring Boot 3.2.5 + MyBatis-Plus + JWT

前端内置 `axios-mock-adapter` 本地数据兜底，可**脱离后端独立运行**；关闭 Mock 后通过 Vite 代理转发至真实后端，无缝对接。

## 技术栈

| 分层 | 选型 |
| --- | --- |
| 前端构建 | Vite 5 + React 18 + TypeScript 5 |
| 前端 UI | Ant Design v5 + @ant-design/icons + lucide-react |
| 前端路由 | react-router-dom v6（路由守卫 + 动态权限菜单） |
| 前端状态 | Zustand |
| 前端请求 | Axios + 拦截器 + axios-mock-adapter |
| 前端图表 | Recharts |
| 后端框架 | Spring Boot 3.2.5 |
| 持久层 | MyBatis-Plus 3.5.7 |
| 鉴权 | JWT（HS256）无状态 Token |
| 数据库 | MySQL 8（默认） |
| 构建 | Maven / npm |

## 目录结构

```
.
├── test/                    # 前端 (React + Vite)
│   ├── src/                 # 业务代码
│   ├── public/
│   ├── dist/                # 构建产物 (git 忽略)
│   ├── package.json
│   └── README.md            # 前端详细文档
├── testBack/                # 后端 (Spring Boot)
│   ├── src/main/java/...    # 业务代码
│   ├── src/main/resources/  # application.yml / db/*.sql
│   ├── target/              # 构建产物 (git 忽略)
│   ├── pom.xml
│   └── README.md            # 后端详细文档
└── .github/workflows/ci.yml # CI：前端构建 + 后端打包
```

## 快速开始

### 1. 前端（独立运行，无需后端）

```bash
cd test
npm install
npm run dev        # http://localhost:5173 （默认开启 Mock 数据）
```

生产构建：

```bash
npm run build      # 产物输出至 test/dist/
npm run preview    # 本地预览构建产物 (http://localhost:4173)
```

### 2. 后端（需 MySQL）

```sql
CREATE DATABASE book_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

按需修改 `testBack/src/main/resources/application.yml` 中的数据库连接（`spring.datasource.username/password`，默认 `root/root`）与 `jwt.secret`。

```bash
cd testBack
mvn spring-boot:run     # 监听 http://localhost:8080/api
```

首次启动会自动建表并写入演示数据（`db/schema.sql` / `db/data.sql`，使用 `IF NOT EXISTS` / `INSERT IGNORE`，可重复启动）。

### 3. 前后端联调

将前端 `.env.*` 中的 `VITE_USE_MOCK` 设为 `false`、`VITE_API_BASE_URL=/api`，启动 `npm run dev`，
请求经 Vite 代理（`/api` → `http://localhost:8080`）转发至后端。

## 演示账号

| 账号 | 密码 | 角色 | 权限范围 |
| --- | --- | --- | --- |
| `admin` | `123456` | 超级管理员 | 全部权限 |
| `librarian` | `123456` | 图书管理员 | 看板 / 图书 / 分类 / 用户 / 借阅（不含系统设置） |

## 接口约定（前后端一致）

- 统一响应信封：`{ code: 0, data, message }`（`code === 0` 视为成功；未认证返回 `code: 401`，HTTP 200）
- 分页返回：`{ list, total, page, pageSize }`
- 上下文路径：`/api`
- 登录 `POST /api/auth/login` 入参 `{username,password}`，返回 `{token,userInfo}`

## 详细文档

- 前端功能、环境变量、权限码、目录结构：见 [`test/README.md`](test/README.md)
- 后端接口表、环境准备、目录结构：见 [`testBack/README.md`](testBack/README.md)

## CI

每次推送到 `main` 或发起 PR，GitHub Actions 会并行执行：

- **前端**：`npm ci` + `npm run build`（含 `tsc` 类型检查）
- **后端**：JDK 21 + `mvn -B package -DskipTests`

配置文件见 [`.github/workflows/ci.yml`](.github/workflows/ci.yml)。
