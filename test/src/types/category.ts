// 图书分类类型

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  sort: number;
  description: string;
  bookCount: number;
  createdAt: string;
}

/** 分类新增/编辑表单 */
export type CategoryForm = Omit<Category, 'id' | 'bookCount' | 'createdAt'>;
