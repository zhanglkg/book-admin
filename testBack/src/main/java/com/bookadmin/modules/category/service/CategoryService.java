package com.bookadmin.modules.category.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.bookadmin.common.result.BizException;
import com.bookadmin.modules.category.dto.CategoryForm;
import com.bookadmin.modules.category.entity.Category;
import com.bookadmin.modules.category.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;

    public List<Category> listCategories() {
        return categoryMapper.selectAllWithCount();
    }

    public Category createCategory(CategoryForm form) {
        Category category = new Category();
        BeanUtils.copyProperties(form, category);
        category.setBookCount(0);
        category.setCreatedAt(LocalDateTime.now());
        categoryMapper.insert(category);
        return category;
    }

    public Category updateCategory(Long id, CategoryForm form) {
        if (categoryMapper.selectById(id) == null) {
            throw new BizException("分类不存在");
        }
        Category category = new Category();
        BeanUtils.copyProperties(form, category);
        category.setId(id);
        categoryMapper.updateById(category);
        return categoryMapper.selectById(id);
    }

    public void deleteCategory(Long id) {
        Long childCount = categoryMapper.selectCount(
                Wrappers.<Category>lambdaQuery().eq(Category::getParentId, id));
        if (childCount != null && childCount > 0) {
            throw new BizException("该分类存在子分类，无法删除");
        }
        categoryMapper.deleteById(id);
    }
}
