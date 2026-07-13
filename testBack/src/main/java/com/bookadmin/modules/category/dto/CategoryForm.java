package com.bookadmin.modules.category.dto;

import lombok.Data;

/**
 * 分类新增/编辑表单,对应前端 CategoryForm (Omit<Category,'id'|'bookCount'|'createdAt'>)。
 */
@Data
public class CategoryForm {

    private String name;
    private Long parentId;
    private Integer sort;
    private String description;
}
