-- 智阅图书后台管理系统 数据库初始化 (MySQL 8 语法)
-- 说明:数据源已指定数据库 book_admin,请先手动创建该库:
--   CREATE DATABASE book_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS account (
  id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL,
  password    VARCHAR(100) NOT NULL,
  nickname    VARCHAR(50),
  avatar      VARCHAR(255),
  email       VARCHAR(100),
  phone       VARCHAR(20),
  role_code   VARCHAR(50),
  role_name   VARCHAR(50),
  status      VARCHAR(20)  DEFAULT 'active',
  created_at  DATETIME,
  UNIQUE KEY uk_account_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='登录账号(管理员/图书管理员)';

CREATE TABLE IF NOT EXISTS role (
  id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(50),
  code        VARCHAR(50),
  description VARCHAR(255),
  permissions TEXT,
  created_at  DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色与权限';

CREATE TABLE IF NOT EXISTS category (
  id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  parent_id   BIGINT,
  sort        INT          DEFAULT 0,
  description VARCHAR(255),
  book_count  INT          DEFAULT 0,
  created_at  DATETIME,
  KEY idx_category_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书分类(树形)';

CREATE TABLE IF NOT EXISTS book (
  id          BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  author      VARCHAR(100),
  isbn        VARCHAR(20),
  category_id BIGINT,
  publisher   VARCHAR(100),
  price       DECIMAL(10,2),
  stock       INT,
  cover       VARCHAR(255),
  status      VARCHAR(10),
  description TEXT,
  created_at  DATETIME,
  KEY idx_book_category (category_id),
  KEY idx_book_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书';

CREATE TABLE IF NOT EXISTS member (
  id           BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(50),
  nickname     VARCHAR(50),
  avatar       VARCHAR(255),
  email        VARCHAR(100),
  phone        VARCHAR(20),
  gender       VARCHAR(10),
  status       VARCHAR(20),
  borrow_count INT          DEFAULT 0,
  created_at   DATETIME,
  KEY idx_member_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员/读者';

CREATE TABLE IF NOT EXISTS borrow_record (
  id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  book_id     BIGINT,
  book_title  VARCHAR(200),
  book_cover  VARCHAR(255),
  user_id     BIGINT,
  user_name   VARCHAR(50),
  borrow_date DATE,
  due_date    DATE,
  return_date DATE,
  status      VARCHAR(20),
  KEY idx_borrow_status (status),
  KEY idx_borrow_date (borrow_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='借阅记录';
