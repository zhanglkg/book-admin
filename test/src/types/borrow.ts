// 借阅相关类型
import type { PageParams } from './api';

export type BorrowStatus = 'borrowing' | 'returned' | 'overdue';

/** 借阅记录 */
export interface BorrowRecord {
  id: number;
  bookId: number;
  bookTitle: string;
  bookCover: string;
  userId: number;
  userName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: BorrowStatus;
}

/** 借阅查询参数 */
export interface BorrowQuery extends PageParams {
  keyword?: string;
  status?: BorrowStatus;
}

/** 借书登记表单 */
export interface BorrowForm {
  bookId: number;
  userId: number;
  dueDate: string;
  /** 冗余展示字段（可选，便于登记时回显） */
  bookTitle?: string;
  userName?: string;
}
