package com.bookadmin.modules.dashboard.dto;

import lombok.Data;

/**
 * 看板统计卡片,字段名与前端 src/types/dashboard.ts 的 DashboardStats 严格对应。
 */
@Data
public class DashboardStats {

    private long totalBooks;
    private long totalBorrows;
    private long totalUsers;
    private long totalCategories;
    private long borrowingCount;
    private long overdueCount;
}
