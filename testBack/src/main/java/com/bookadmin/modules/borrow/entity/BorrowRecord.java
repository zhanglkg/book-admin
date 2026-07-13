package com.bookadmin.modules.borrow.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;

/**
 * 借阅记录,与前端 src/types/borrow.ts 的 BorrowRecord 对应。
 */
@Data
@TableName("borrow_record")
public class BorrowRecord {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookCover;
    private Long userId;
    private String userName;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private String status;
}
