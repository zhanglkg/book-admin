# 智阅图书后台管理系统 · 后端

基于 `test/` 前端(React + TypeScript + Vite + Ant Design)接口契约实现的后端服务。

- 语言/框架:Java 17 + Spring Boot 3.2
- 持久层:MyBatis-Plus 3.5.x
- 数据库:MySQL 8.x(建表与种子数据均为 MySQL 语法)
- 鉴权:JWT(HS256)无状态 Token + HandlerInterceptor 校验
- 构建:Maven

## 接口约定(与前端严格一致)

- 统一响应信封:`{ code: 0, data, message }`(`code === 0` 视为成功;未认证返回 `code: 401`,HTTP 200)
- 分页返回:`{ list, total, page, pageSize }`
- 上下文路径:`/api`(与前端 Vite 代理 `/api -> http://localhost:8080` 对齐)

| 模块 | 方法 & 路径 | 说明 |
| --- | --- | --- |
| 鉴权 | `POST /api/auth/login` | 登录,入参 `{username,password}`,返回 `{token,userInfo}` |
| 鉴权 | `GET /api/auth/profile` | 当前用户信息(需 `Authorization: Bearer <token>`) |
| 系统 | `GET /api/system/roles` | 角色列表 |
| 系统 | `PUT /api/system/roles/{id}/permissions` | 更新角色权限,入参 `{permissions: string[]}` |
| 图书 | `GET/POST /api/books`、`GET/PUT/DELETE /api/books/{id}` | 分页(关键字/分类/状态)、增删改 |
| 分类 | `GET/POST /api/categories`、`GET/PUT/DELETE /api/categories/{id}` | 树形,有子分类时禁止删除 |
| 会员 | `GET/POST /api/users`、`GET/PUT/DELETE /api/users/{id}` | 分页、增删改 |
| 借阅 | `GET/POST /api/borrows`、`PUT /api/borrows/{id}/return` | 登记、还书、查询(状态动态计算) |
| 看板 | `GET /api/dashboard/stats`、`/trend`、`/category-distribution` | 统计卡片、近7天趋势、分类分布 |

## 环境准备

1. 安装 JDK 17+、Maven 3.8+
2. 安装并启动 MySQL 8.x,创建数据库:

```sql
CREATE DATABASE book_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

3. 修改 `src/main/resources/application.yml` 中的数据库连接信息(`spring.datasource.username/password`),
   以及 `jwt.secret`(生产环境请替换为足够长的随机密钥)。

> 应用首次启动会通过 `schema.sql` 自动建表、`data.sql` 写入角色/分类/图书/会员/借阅演示数据
> (使用 `IF NOT EXISTS` / `INSERT IGNORE`,可重复启动);登录账号 `admin` / `librarian`
> 由 `SeedDataRunner` 在首次启动时以 BCrypt 加密写入密码 `123456`。

## 运行

```bash
cd testBack
mvn spring-boot:run
```

启动成功后后端监听 `http://localhost:8080`。

## 演示账号

| 账号 | 密码 | 角色 | 权限范围 |
| --- | --- | --- | --- |
| `admin` | `123456` | 超级管理员 | 全部权限 |
| `librarian` | `123456` | 图书管理员 | 看板/图书/分类/用户/借阅(不含系统设置) |

## 对接前端

将 `test/` 前端 `.env.*` 中 `VITE_USE_MOCK` 设为 `false`,`VITE_API_BASE_URL=/api`,
启动前端 `npm run dev`,请求经 Vite 代理转发至本后端。

## 目录结构

```
src/main/java/com/bookadmin/
├── BookAdminApplication.java
├── common/      # 统一响应 R、全局异常、分页 PageResult、MyBatis-Plus/Web 配置
├── security/    # JwtUtil、JwtInterceptor、UserContext、JwtProperties
└── modules/
    ├── auth/        # 账号、角色、登录、个人信息、SeedDataRunner
    ├── system/      # 系统设置(角色权限)控制器
    ├── book/        # 图书
    ├── category/    # 分类
    ├── member/      # 会员(对应前端 /users)
    ├── borrow/      # 借阅
    └── dashboard/   # 数据看板
src/main/resources/
├── application.yml
└── db/  # schema.sql(建表) + data.sql(演示数据,MySQL 语法)
```
