package com.bookadmin.modules.book.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 图书新增/编辑表单,对应前端 BookForm (Omit<Book,'id'|'categoryName'|'createdAt'>)。
 */
@Data
public class BookForm {

    private String title;
    private String author;
    private String isbn;
    private Long categoryId;
    private String publisher;
    private BigDecimal price;
    private Integer stock;
    private String cover;
    private String status;
    private String description;
}
