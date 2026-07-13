// 统一响应信封与分页类型

/** 后端统一响应结构 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

/** 分页查询参数 */
export interface PageParams {
  page?: number;
  pageSize?: number;
}

/** 分页返回结果 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
