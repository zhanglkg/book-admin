package com.bookadmin.modules.borrow.dto;

import lombok.Data;

/**
 * 借阅查询参数,对应前端 BorrowQuery。
 */
@Data
public class BorrowQuery {

    private Integer page = 1;
    private Integer pageSize = 10;
    private String keyword;
    private String status;
}
