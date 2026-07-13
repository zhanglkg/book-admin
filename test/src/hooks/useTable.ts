import { useCallback, useEffect, useState } from 'react';
import type { PageResult } from '@/types/api';

interface UseTableOptions<T, P> {
  /** 列表查询接口（需返回分页结构） */
  fetch: (params: P) => Promise<PageResult<T>>;
  /** 默认查询参数 */
  defaultParams?: P;
  /** 默认每页条数 */
  defaultPageSize?: number;
}

/**
 * 列表查询/分页/搜索复用 Hook
 * - 自动在参数或页码变化时请求
 * - search 重置到第一页，reset 还原默认参数
 */
export function useTable<T, P = Record<string, unknown>>(options: UseTableOptions<T, P>) {
  const { fetch, defaultParams = {} as P, defaultPageSize = 10 } = options;
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<P>(defaultParams);

  const load = useCallback(() => {
    setLoading(true);
    fetch({ ...params, page, pageSize } as P)
      .then((res) => {
        setData(res.list);
        setTotal(res.total);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [fetch, params, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const search = useCallback((next: P) => {
    setParams(next);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setParams(defaultParams);
    setPage(1);
  }, [defaultParams]);

  const changePage = useCallback((nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  }, []);

  return { data, total, page, pageSize, loading, params, search, reset, changePage, reload: load };
}
