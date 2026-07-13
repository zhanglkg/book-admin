package com.bookadmin.modules.dashboard.service;

import com.bookadmin.modules.book.mapper.BookMapper;
import com.bookadmin.modules.borrow.mapper.BorrowRecordMapper;
import com.bookadmin.modules.category.mapper.CategoryMapper;
import com.bookadmin.modules.dashboard.dto.*;
import com.bookadmin.modules.dashboard.mapper.DashboardMapper;
import com.bookadmin.modules.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookMapper bookMapper;
    private final MemberMapper memberMapper;
    private final CategoryMapper categoryMapper;
    private final BorrowRecordMapper borrowMapper;
    private final DashboardMapper dashboardMapper;

    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalBooks(bookMapper.selectCount(null));
        stats.setTotalUsers(memberMapper.selectCount(null));
        stats.setTotalCategories(categoryMapper.selectCount(null));
        stats.setTotalBorrows(borrowMapper.selectCount(null));
        stats.setBorrowingCount(borrowMapper.countBorrowing());
        stats.setOverdueCount(borrowMapper.countOverdue());
        return stats;
    }

    public List<TrendPoint> getTrend() {
        return dashboardMapper.selectTrend();
    }

    public List<CategoryDistribution> getCategoryDistribution() {
        return dashboardMapper.selectCategoryDistribution();
    }
}
