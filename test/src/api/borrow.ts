import request from '@/utils/request';
import type { ApiResponse, PageResult } from '@/types/api';
import type { BorrowRecord, BorrowQuery, BorrowForm } from '@/types/borrow';

export function getBorrows(params: BorrowQuery) {
  return request.get<ApiResponse<PageResult<BorrowRecord>>>('/borrows', { params }).then((r) => r.data.data);
}
export function borrowBook(data: BorrowForm) {
  return request.post<ApiResponse<BorrowRecord>>('/borrows', data).then((r) => r.data.data);
}
export function returnBook(id: number) {
  return request.put<ApiResponse<BorrowRecord>>(`/borrows/${id}/return`).then((r) => r.data.data);
}
