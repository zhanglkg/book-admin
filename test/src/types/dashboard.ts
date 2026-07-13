// 数据看板统计类型

export interface DashboardStats {
  totalBooks: number;
  totalBorrows: number;
  totalUsers: number;
  totalCategories: number;
  borrowingCount: number;
  overdueCount: number;
}

export interface TrendPoint {
  date: string;
  borrow: number;
  return: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
}
