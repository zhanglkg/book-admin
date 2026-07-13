package com.bookadmin.modules.category.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bookadmin.modules.category.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {

    /**
     * 查询全部分类,实时统计每个分类下的图书数量。
     */
    @Select("SELECT c.*, COUNT(b.id) AS book_count " +
            "FROM category c LEFT JOIN book b ON b.category_id = c.id " +
            "GROUP BY c.id ORDER BY c.sort, c.id")
    List<Category> selectAllWithCount();
}
