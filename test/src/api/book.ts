import request from '@/utils/request';
import type { ApiResponse, PageResult } from '@/types/api';
import type { Book, BookQuery, BookForm } from '@/types/book';

export function getBooks(params: BookQuery) {
  return request.get<ApiResponse<PageResult<Book>>>('/books', { params }).then((r) => r.data.data);
}
export function getBook(id: number) {
  return request.get<ApiResponse<Book>>(`/books/${id}`).then((r) => r.data.data);
}
export function createBook(data: BookForm) {
  return request.post<ApiResponse<Book>>('/books', data).then((r) => r.data.data);
}
export function updateBook(id: number, data: BookForm) {
  return request.put<ApiResponse<Book>>(`/books/${id}`, data).then((r) => r.data.data);
}
export function deleteBook(id: number) {
  return request.delete<ApiResponse<null>>(`/books/${id}`).then((r) => r.data.data);
}
