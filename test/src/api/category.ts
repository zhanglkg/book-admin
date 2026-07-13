import request from '@/utils/request';
import type { ApiResponse } from '@/types/api';
import type { Category, CategoryForm } from '@/types/category';

export function getCategories() {
  return request.get<ApiResponse<Category[]>>('/categories').then((r) => r.data.data);
}
export function createCategory(data: CategoryForm) {
  return request.post<ApiResponse<Category>>('/categories', data).then((r) => r.data.data);
}
export function updateCategory(id: number, data: CategoryForm) {
  return request.put<ApiResponse<Category>>(`/categories/${id}`, data).then((r) => r.data.data);
}
export function deleteCategory(id: number) {
  return request.delete<ApiResponse<null>>(`/categories/${id}`).then((r) => r.data.data);
}
