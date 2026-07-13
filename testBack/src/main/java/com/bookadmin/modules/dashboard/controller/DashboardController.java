package com.bookadmin.modules.dashboard.controller;

import com.bookadmin.common.result.R;
import com.bookadmin.modules.dashboard.dto.CategoryDistribution;
import com.bookadmin.modules.dashboard.dto.DashboardStats;
import com.bookadmin.modules.dashboard.dto.TrendPoint;
import com.bookadmin.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public R<DashboardStats> stats() {
        return R.ok(dashboardService.getStats());
    }

    @GetMapping("/trend")
    public R<List<TrendPoint>> trend() {
        return R.ok(dashboardService.getTrend());
    }

    @GetMapping("/category-distribution")
    public R<List<CategoryDistribution>> categoryDistribution() {
        return R.ok(dashboardService.getCategoryDistribution());
    }
}
