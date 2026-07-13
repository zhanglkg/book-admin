package com.bookadmin.modules.book.dto;

import lombok.Data;

/**
 * 图书查询参数,对应前端 BookQuery。
 */
@Data
public class BookQuery {

    private Integer page = 1;
    private Integer pageSize = 10;
    private String keyword;
    private Long categoryId;
    private String status;
}
