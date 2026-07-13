package com.bookadmin.modules.dashboard.dto;

import lombok.Data;

/**
 * 分类分布,对应前端 CategoryDistribution (name, value)。
 */
@Data
public class CategoryDistribution {

    private String name;
    private long value;
}
