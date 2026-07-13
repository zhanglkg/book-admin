// 图书相关类型
import type { PageParams } from './api';

export type BookStatus = 'on' | 'off';

/** 图书 */
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  categoryId: number;
  categoryName: string;
  publisher: string;
  price: number;
  stock: number;
  cover: string;
  status: BookStatus;
  description: string;
  createdAt: string;
}

/** 图书查询参数 */
export interface BookQuery extends PageParams {
  keyword?: string;
  categoryId?: number;
  status?: BookStatus;
}

/** 图书新增/编辑表单 */
export type BookForm = Omit<Book, 'id' | 'categoryName' | 'createdAt'>;
