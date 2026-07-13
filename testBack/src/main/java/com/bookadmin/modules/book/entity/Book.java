package com.bookadmin.modules.book.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 图书,与前端 src/types/book.ts 的 Book 对应。
 * categoryName 为关联展示字段,不入库。
 */
@Data
@TableName("book")
public class Book {

    @TableId(type = IdType.AUTO)
    private Long id;
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
    private LocalDateTime createdAt;

    @TableField(exist = false)
    private String categoryName;
}
