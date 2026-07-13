import request from '@/utils/request';
import type { ApiResponse } from '@/types/api';
import type { DashboardStats, TrendPoint, CategoryDistribution } from '@/types/dashboard';

export function getDashboardStats() {
  return request.get<ApiResponse<DashboardStats>>('/dashboard/stats').then((r) => r.data.data);
}
export function getBorrowTrend() {
  return request.get<ApiResponse<TrendPoint[]>>('/dashboard/trend').then((r) => r.data.data);
}
export function getCategoryDistribution() {
  return request.get<ApiResponse<CategoryDistribution[]>>('/dashboard/category-distribution').then((r) => r.data.data);
}
