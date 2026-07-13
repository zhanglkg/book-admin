package com.bookadmin.modules.borrow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookadmin.modules.borrow.dto.BorrowQuery;
import com.bookadmin.modules.borrow.entity.BorrowRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BorrowRecordMapper extends BaseMapper<BorrowRecord> {

    /**
     * 分页查询借阅记录,动态计算状态(已归还 / 逾期 / 借阅中),支持关键字与状态筛选。
     */
    @Select("<script>" +
            "SELECT id, book_id, book_title, book_cover, user_id, user_name, borrow_date, due_date, return_date, " +
            "  CASE WHEN status = 'returned' THEN 'returned' " +
            "       WHEN due_date &lt; CURDATE() THEN 'overdue' " +
            "       ELSE 'borrowing' END AS status " +
            "FROM borrow_record " +
            "<where>" +
            "  <if test='q.keyword != null and q.keyword != \"\"'>" +
            "    AND (book_title LIKE CONCAT('%', #{q.keyword}, '%') " +
            "      OR user_name LIKE CONCAT('%', #{q.keyword}, '%'))" +
            "  </if>" +
            "  <if test='q.status != null and q.status != \"\"'>" +
            "    AND (CASE WHEN status = 'returned' THEN 'returned' " +
            "            WHEN due_date &lt; CURDATE() THEN 'overdue' " +
            "            ELSE 'borrowing' END) = #{q.status}" +
            "  </if>" +
            "</where>" +
            "ORDER BY id DESC" +
            "</script>")
    Page<BorrowRecord> selectBorrowPage(Page<BorrowRecord> page, @Param("q") BorrowQuery q);

    @Select("SELECT COUNT(*) FROM borrow_record WHERE status != 'returned' AND due_date >= CURDATE()")
    long countBorrowing();

    @Select("SELECT COUNT(*) FROM borrow_record WHERE status != 'returned' AND due_date < CURDATE()")
    long countOverdue();
}
