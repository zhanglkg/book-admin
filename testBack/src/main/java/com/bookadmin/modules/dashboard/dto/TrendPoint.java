package com.bookadmin.modules.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 借阅趋势点,对应前端 TrendPoint (date, borrow, return)。
 * 注意:return 为 Java 关键字,字段命名为 returnCount,JSON 序列化为 "return"。
 */
@Data
public class TrendPoint {

    private String date;
    private long borrow;

    @JsonProperty("return")
    private long returnCount;
}
