package com.bookadmin.modules.book.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookadmin.modules.book.dto.BookQuery;
import com.bookadmin.modules.book.entity.Book;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BookMapper extends BaseMapper<Book> {

    /**
     * 分页查询图书,关联分类名称,支持关键字/分类/状态筛选。
     */
    @Select("<script>" +
            "SELECT b.*, c.name AS category_name " +
            "FROM book b LEFT JOIN category c ON b.category_id = c.id " +
            "<where>" +
            "  <if test='q.keyword != null and q.keyword != \"\"'>" +
            "    AND (b.title LIKE CONCAT('%', #{q.keyword}, '%') " +
            "      OR b.author LIKE CONCAT('%', #{q.keyword}, '%') " +
            "      OR b.isbn LIKE CONCAT('%', #{q.keyword}, '%'))" +
            "  </if>" +
            "  <if test='q.categoryId != null'>AND b.category_id = #{q.categoryId}</if>" +
            "  <if test='q.status != null and q.status != \"\"'>AND b.status = #{q.status}</if>" +
            "</where>" +
            "ORDER BY b.id DESC" +
            "</script>")
    Page<Book> selectBookPage(Page<Book> page, @Param("q") BookQuery q);

    @Select("SELECT b.*, c.name AS category_name " +
            "FROM book b LEFT JOIN category c ON b.category_id = c.id " +
            "WHERE b.id = #{id}")
    Book selectBookById(@Param("id") Long id);
}
