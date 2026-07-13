package com.bookadmin.modules.dashboard.mapper;

import com.bookadmin.modules.dashboard.dto.CategoryDistribution;
import com.bookadmin.modules.dashboard.dto.TrendPoint;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DashboardMapper {

    /**
     * 近 7 天借阅 / 归还趋势。
     */
    @Select("WITH RECURSIVE d(n) AS (SELECT 0 UNION ALL SELECT n + 1 FROM d WHERE n < 6) " +
            "SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (6 - d.n) DAY), '%m-%d') AS date, " +
            "  (SELECT COUNT(*) FROM borrow_record WHERE DATE(borrow_date) = DATE_SUB(CURDATE(), INTERVAL (6 - d.n) DAY)) AS borrow, " +
            "  (SELECT COUNT(*) FROM borrow_record WHERE DATE(return_date) = DATE_SUB(CURDATE(), INTERVAL (6 - d.n) DAY)) AS return_count " +
            "FROM d ORDER BY d.n")
    List<TrendPoint> selectTrend();

    /**
     * 各分类图书数量分布。
     */
    @Select("SELECT c.name AS name, COUNT(b.id) AS value " +
            "FROM category c LEFT JOIN book b ON b.category_id = c.id " +
            "GROUP BY c.id ORDER BY c.sort, c.id")
    List<CategoryDistribution> selectCategoryDistribution();
}
