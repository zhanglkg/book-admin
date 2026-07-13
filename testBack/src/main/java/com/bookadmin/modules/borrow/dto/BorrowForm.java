package com.bookadmin.modules.borrow.dto;

import lombok.Data;

import java.time.LocalDate;

/**
 * 借书登记表单,对应前端 BorrowForm。
 */
@Data
public class BorrowForm {

    private Long bookId;
    private Long userId;
    private LocalDate dueDate;
    /** 冗余展示字段(可选) */
    private String bookTitle;
    private String userName;
}
