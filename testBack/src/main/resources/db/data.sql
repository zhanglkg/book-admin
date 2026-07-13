-- 演示数据初始化 (MySQL 语法)
-- 账号(admin/librarian)由应用启动时以 BCrypt 注入,见 SeedDataRunner,此处不写入明文/哈希密码。
-- 所有 INSERT 使用 INSERT IGNORE,保证应用可重复启动而不报主键冲突。

-- 角色
INSERT IGNORE INTO role (id, name, code, description, permissions, created_at) VALUES
(1, '超级管理员', 'admin', '拥有系统全部权限', 'dashboard:view,book:view,book:add,book:edit,book:delete,category:view,category:edit,user:view,user:edit,borrow:view,borrow:manage,system:view,system:role', '2025-01-01 00:00:00'),
(2, '图书管理员', 'librarian', '负责图书与借阅日常运营', 'dashboard:view,book:view,book:add,book:edit,category:view,user:view,borrow:view,borrow:manage', '2025-01-01 00:00:00'),
(3, '只读访客', 'guest', '仅可查看,不可修改', 'dashboard:view,book:view,category:view,user:view,borrow:view', '2025-01-01 00:00:00');

-- 分类 (含二级分类 21/22)
INSERT IGNORE INTO category (id, name, parent_id, sort, description, book_count, created_at) VALUES
(1,  '文学小说', NULL, 1, '小说、散文、诗歌等文学作品', 8, '2025-01-02 10:00:00'),
(2,  '科学技术', NULL, 2, '计算机、数理化、自然科学',   6, '2025-01-02 10:05:00'),
(3,  '经济管理', NULL, 3, '经济、金融、管理类读物',     6, '2025-01-02 10:10:00'),
(4,  '历史传记', NULL, 4, '历史、人物传记',             6, '2025-01-02 10:15:00'),
(5,  '少儿读物', NULL, 5, '儿童绘本与青少年读物',       4, '2025-01-02 10:20:00'),
(6,  '艺术设计', NULL, 6, '设计、美术、摄影',           4, '2025-01-02 10:25:00'),
(21, '编程语言', 2,    1, 'Python、Java、Go 等',        0, '2025-02-01 10:00:00'),
(22, '人工智能', 2,    2, '机器学习、深度学习',         0, '2025-02-01 10:05:00');

-- 图书 (34 本,字段与前端 types/book.ts 对应;price/isbn/cover/status/created_at 由表达式计算)
INSERT IGNORE INTO book (id, title, author, isbn, category_id, publisher, price, stock, cover, status, description, created_at) VALUES
(1001, '活着', '余华', CONCAT('9787',LPAD(100000+0*37,9,'0')), 1, '作家出版社', ROUND(29+(0%10)*6.8,2), 5, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','活着'), 'off', CONCAT('《','活着','》是','余华','的代表作，由','作家出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 0 DAY)),
(1002, '百年孤独', '加西亚·马尔克斯', CONCAT('9787',LPAD(100000+1*37,9,'0')), 1, '南海出版公司', ROUND(29+(1%10)*6.8,2), 6, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','百年孤独'), 'on', CONCAT('《','百年孤独','》是','加西亚·马尔克斯','的代表作，由','南海出版公司','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 1 DAY)),
(1003, '围城', '钱钟书', CONCAT('9787',LPAD(100000+2*37,9,'0')), 1, '人民文学出版社', ROUND(29+(2%10)*6.8,2), 7, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','围城'), 'on', CONCAT('《','围城','》是','钱钟书','的代表作，由','人民文学出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 2 DAY)),
(1004, '三体', '刘慈欣', CONCAT('9787',LPAD(100000+3*37,9,'0')), 1, '重庆出版社', ROUND(29+(3%10)*6.8,2), 8, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','三体'), 'on', CONCAT('《','三体','》是','刘慈欣','的代表作，由','重庆出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 3 DAY)),
(1005, '人间失格', '太宰治', CONCAT('9787',LPAD(100000+4*37,9,'0')), 1, '作家出版社', ROUND(29+(4%10)*6.8,2), 9, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','人间失格'), 'off', CONCAT('《','人间失格','》是','太宰治','的代表作，由','作家出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 4 DAY)),
(1006, '解忧杂货店', '东野圭吾', CONCAT('9787',LPAD(100000+5*37,9,'0')), 1, '南海出版公司', ROUND(29+(5%10)*6.8,2), 10, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','解忧杂货店'), 'on', CONCAT('《','解忧杂货店','》是','东野圭吾','的代表作，由','南海出版公司','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 5 DAY)),
(1007, '认知觉醒', '周岭', CONCAT('9787',LPAD(100000+6*37,9,'0')), 2, '人民邮电出版社', ROUND(29+(6%10)*6.8,2), 11, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','认知觉醒'), 'on', CONCAT('《','认知觉醒','》是','周岭','的代表作，由','人民邮电出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 6 DAY)),
(1008, '时间简史', '霍金', CONCAT('9787',LPAD(100000+7*37,9,'0')), 2, '湖南科技出版社', ROUND(29+(7%10)*6.8,2), 12, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','时间简史'), 'on', CONCAT('《','时间简史','》是','霍金','的代表作，由','湖南科技出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 7 DAY)),
(1009, '深度学习', 'Ian Goodfellow', CONCAT('9787',LPAD(100000+8*37,9,'0')), 2, '机械工业出版社', ROUND(29+(8%10)*6.8,2), 13, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','深度学习'), 'off', CONCAT('《','深度学习','》是','Ian Goodfellow','的代表作，由','机械工业出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 8 DAY)),
(1010, 'Python编程', 'Eric Matthes', CONCAT('9787',LPAD(100000+9*37,9,'0')), 2, '人民邮电出版社', ROUND(29+(9%10)*6.8,2), 14, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','Python编程'), 'on', CONCAT('《','Python编程','》是','Eric Matthes','的代表作，由','人民邮电出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 9 DAY)),
(1011, '经济学原理', '曼昆', CONCAT('9787',LPAD(100000+10*37,9,'0')), 3, '北京大学出版社', ROUND(29+(10%10)*6.8,2), 15, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','经济学原理'), 'on', CONCAT('《','经济学原理','》是','曼昆','的代表作，由','北京大学出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 10 DAY)),
(1012, '穷查理宝典', '查理·芒格', CONCAT('9787',LPAD(100000+11*37,9,'0')), 3, '中信出版社', ROUND(29+(11%10)*6.8,2), 16, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','穷查理宝典'), 'on', CONCAT('《','穷查理宝典','》是','查理·芒格','的代表作，由','中信出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 11 DAY)),
(1013, '原则', '瑞·达利欧', CONCAT('9787',LPAD(100000+12*37,9,'0')), 3, '中信出版社', ROUND(29+(12%10)*6.8,2), 17, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','原则'), 'off', CONCAT('《','原则','》是','瑞·达利欧','的代表作，由','中信出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 12 DAY)),
(1014, '穷爸爸富爸爸', '罗伯特·清崎', CONCAT('9787',LPAD(100000+13*37,9,'0')), 3, '南海出版公司', ROUND(29+(13%10)*6.8,2), 18, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','穷爸爸富爸爸'), 'on', CONCAT('《','穷爸爸富爸爸','》是','罗伯特·清崎','的代表作，由','南海出版公司','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 13 DAY)),
(1015, '万历十五年', '黄仁宇', CONCAT('9787',LPAD(100000+14*37,9,'0')), 4, '生活·读书·新知三联书店', ROUND(29+(14%10)*6.8,2), 19, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','万历十五年'), 'on', CONCAT('《','万历十五年','》是','黄仁宇','的代表作，由','生活·读书·新知三联书店','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 14 DAY)),
(1016, '明朝那些事儿', '当年明月', CONCAT('9787',LPAD(100000+15*37,9,'0')), 4, '浙江人民出版社', ROUND(29+(15%10)*6.8,2), 20, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','明朝那些事儿'), 'on', CONCAT('《','明朝那些事儿','》是','当年明月','的代表作，由','浙江人民出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 15 DAY)),
(1017, '人类简史', '尤瓦尔·赫拉利', CONCAT('9787',LPAD(100000+16*37,9,'0')), 4, '中信出版社', ROUND(29+(16%10)*6.8,2), 21, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','人类简史'), 'off', CONCAT('《','人类简史','》是','尤瓦尔·赫拉利','的代表作，由','中信出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 16 DAY)),
(1018, '苏东坡传', '林语堂', CONCAT('9787',LPAD(100000+17*37,9,'0')), 4, '湖南文艺出版社', ROUND(29+(17%10)*6.8,2), 22, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','苏东坡传'), 'on', CONCAT('《','苏东坡传','》是','林语堂','的代表作，由','湖南文艺出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 17 DAY)),
(1019, '小王子', '圣埃克苏佩里', CONCAT('9787',LPAD(100000+18*37,9,'0')), 5, '人民文学出版社', ROUND(29+(18%10)*6.8,2), 23, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','小王子'), 'on', CONCAT('《','小王子','》是','圣埃克苏佩里','的代表作，由','人民文学出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 18 DAY)),
(1020, '窗边的小豆豆', '黑柳彻子', CONCAT('9787',LPAD(100000+19*37,9,'0')), 5, '南海出版公司', ROUND(29+(19%10)*6.8,2), 24, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','窗边的小豆豆'), 'on', CONCAT('《','窗边的小豆豆','》是','黑柳彻子','的代表作，由','南海出版公司','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 19 DAY)),
(1021, '哈利·波特', 'J.K.罗琳', CONCAT('9787',LPAD(100000+20*37,9,'0')), 5, '人民文学出版社', ROUND(29+(20%10)*6.8,2), 25, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','哈利·波特'), 'off', CONCAT('《','哈利·波特','》是','J.K.罗琳','的代表作，由','人民文学出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 20 DAY)),
(1022, '夏洛的网', 'E.B.怀特', CONCAT('9787',LPAD(100000+21*37,9,'0')), 5, '上海译文出版社', ROUND(29+(21%10)*6.8,2), 26, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','夏洛的网'), 'on', CONCAT('《','夏洛的网','》是','E.B.怀特','的代表作，由','上海译文出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 21 DAY)),
(1023, '设计中的设计', '原研哉', CONCAT('9787',LPAD(100000+22*37,9,'0')), 6, '山东人民出版社', ROUND(29+(22%10)*6.8,2), 27, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','设计中的设计'), 'on', CONCAT('《','设计中的设计','》是','原研哉','的代表作，由','山东人民出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 22 DAY)),
(1024, '艺术的故事', '贡布里希', CONCAT('9787',LPAD(100000+23*37,9,'0')), 6, '广西美术出版社', ROUND(29+(23%10)*6.8,2), 28, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','艺术的故事'), 'on', CONCAT('《','艺术的故事','》是','贡布里希','的代表作，由','广西美术出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 23 DAY)),
(1025, '写给大家看的设计书', 'Robin Williams', CONCAT('9787',LPAD(100000+24*37,9,'0')), 6, '人民邮电出版社', ROUND(29+(24%10)*6.8,2), 29, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','写给大家看的设计书'), 'off', CONCAT('《','写给大家看的设计书','》是','Robin Williams','的代表作，由','人民邮电出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 24 DAY)),
(1026, '色彩设计的原理', '伊达千代', CONCAT('9787',LPAD(100000+25*37,9,'0')), 6, '中信出版社', ROUND(29+(25%10)*6.8,2), 30, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','色彩设计的原理'), 'on', CONCAT('《','色彩设计的原理','》是','伊达千代','的代表作，由','中信出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 25 DAY)),
(1027, '乡土中国', '费孝通', CONCAT('9787',LPAD(100000+26*37,9,'0')), 1, '生活·读书·新知三联书店', ROUND(29+(26%10)*6.8,2), 31, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','乡土中国'), 'on', CONCAT('《','乡土中国','》是','费孝通','的代表作，由','生活·读书·新知三联书店','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 26 DAY)),
(1028, '罪与罚', '陀思妥耶夫斯基', CONCAT('9787',LPAD(100000+27*37,9,'0')), 1, '人民文学出版社', ROUND(29+(27%10)*6.8,2), 32, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','罪与罚'), 'on', CONCAT('《','罪与罚','》是','陀思妥耶夫斯基','的代表作，由','人民文学出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 27 DAY)),
(1029, '算法导论', 'Thomas Cormen', CONCAT('9787',LPAD(100000+28*37,9,'0')), 2, '机械工业出版社', ROUND(29+(28%10)*6.8,2), 33, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','算法导论'), 'off', CONCAT('《','算法导论','》是','Thomas Cormen','的代表作，由','机械工业出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 28 DAY)),
(1030, '代码整洁之道', 'Robert Martin', CONCAT('9787',LPAD(100000+29*37,9,'0')), 2, '人民邮电出版社', ROUND(29+(29%10)*6.8,2), 34, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','代码整洁之道'), 'on', CONCAT('《','代码整洁之道','》是','Robert Martin','的代表作，由','人民邮电出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 29 DAY)),
(1031, '国富论', '亚当·斯密', CONCAT('9787',LPAD(100000+30*37,9,'0')), 3, '商务印书馆', ROUND(29+(30%10)*6.8,2), 35, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','国富论'), 'on', CONCAT('《','国富论','》是','亚当·斯密','的代表作，由','商务印书馆','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 30 DAY)),
(1032, '小狗钱钱', '博多·舍费尔', CONCAT('9787',LPAD(100000+31*37,9,'0')), 3, '中信出版社', ROUND(29+(31%10)*6.8,2), 36, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','小狗钱钱'), 'on', CONCAT('《','小狗钱钱','》是','博多·舍费尔','的代表作，由','中信出版社','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 31 DAY)),
(1033, '资治通鉴', '司马光', CONCAT('9787',LPAD(100000+32*37,9,'0')), 4, '中华书局', ROUND(29+(32%10)*6.8,2), 37, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','资治通鉴'), 'off', CONCAT('《','资治通鉴','》是','司马光','的代表作，由','中华书局','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 32 DAY)),
(1034, '史记', '司马迁', CONCAT('9787',LPAD(100000+33*37,9,'0')), 4, '中华书局', ROUND(29+(33%10)*6.8,2), 38, CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=','史记'), 'on', CONCAT('《','史记','》是','司马迁','的代表作，由','中华书局','出版，内容详实、见解独到，适合广大读者阅读收藏。'), DATE_SUB(NOW(),INTERVAL 33 DAY));

-- 会员 (20 名,使用递归 CTE 生成,字段与前端 types/user.ts(Member)对应)
INSERT IGNORE INTO member (id, username, nickname, avatar, email, phone, gender, status, borrow_count, created_at)
WITH RECURSIVE nums(n) AS (
  SELECT 0 UNION ALL SELECT n + 1 FROM nums WHERE n < 19
)
SELECT
  2001 + n,
  CONCAT('reader', 1000 + n),
  ELT(n + 1, '张伟','王芳','李娜','刘洋','陈静','杨帆','赵磊','黄敏','周强','吴婷','徐杰','孙丽','马超','朱琳','胡军','郭涛','林峰','何雪','高翔','罗静'),
  CONCAT('https://placehold.co/80x80/52C41A/FFFFFF?text=', LEFT(ELT(n + 1, '张伟','王芳','李娜','刘洋','陈静','杨帆','赵磊','黄敏','周强','吴婷','徐杰','孙丽','马超','朱琳','胡军','郭涛','林峰','何雪','高翔','罗静'), 1)),
  CONCAT('reader', 1000 + n, '@mail.com'),
  CONCAT('139', SUBSTRING(CAST(10000000 + n * 137 AS CHAR), 1, 8)),
  ELT((n % 3) + 1, 'male', 'female', 'unknown'),
  IF(n % 7 = 0, 'disabled', 'active'),
  (n * 3) % 20,
  DATE_SUB(NOW(), INTERVAL n * 3 DAY)
FROM nums;

-- 借阅记录 (32 条,递归 CTE 生成,字段与前端 types/borrow.ts(BorrowRecord)对应)
INSERT IGNORE INTO borrow_record (id, book_id, book_title, book_cover, user_id, user_name, borrow_date, due_date, return_date, status)
WITH RECURSIVE nums(n) AS (
  SELECT 0 UNION ALL SELECT n + 1 FROM nums WHERE n < 31
)
SELECT
  5001 + n,
  1001 + (n % 10),
  ELT((n % 10) + 1, '活着','三体','百年孤独','深度学习','原则','人类简史','小王子','设计中的设计','万历十五年','Python编程'),
  CONCAT('https://placehold.co/120x160/1677ff/FFFFFF?text=', ELT((n % 10) + 1, '活着','三体','百年孤独','深度学习','原则','人类简史','小王子','设计中的设计','万历十五年','Python编程')),
  2001 + (n % 8),
  ELT((n % 8) + 1, '张伟','王芳','李娜','刘洋','陈静','杨帆','赵磊','黄敏'),
  DATE_SUB(CURDATE(), INTERVAL (n * 2 + 1) DAY),
  DATE_ADD(DATE_SUB(CURDATE(), INTERVAL (n * 2 + 1) DAY), INTERVAL 30 DAY),
  IF(n % 3 = 0, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL (n * 2 + 1) DAY), INTERVAL 15 DAY), NULL),
  IF(n % 3 = 0, 'returned', IF(DATE_ADD(DATE_SUB(CURDATE(), INTERVAL (n * 2 + 1) DAY), INTERVAL 30 DAY) < CURDATE(), 'overdue', 'borrowing'))
FROM nums;
