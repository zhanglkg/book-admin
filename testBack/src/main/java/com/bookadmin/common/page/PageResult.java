package com.bookadmin.common.page;

import lombok.Data;

import java.util.List;

/**
 * 分页结果,与前端 src/types/api.ts 中的 PageResult<T> 严格对应:
 * { list, total, page, pageSize }
 */
@Data
public class PageResult<T> {

    private List<T> list;
    private long total;
    private long page;
    private long pageSize;

    public static <T> PageResult<T> of(List<T> list, long total, long page, long pageSize) {
        PageResult<T> result = new PageResult<>();
        result.list = list;
        result.total = total;
        result.page = page;
        result.pageSize = pageSize;
        return result;
    }
}
