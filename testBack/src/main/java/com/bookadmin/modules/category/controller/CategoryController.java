package com.bookadmin.modules.category.controller;

import com.bookadmin.common.result.R;
import com.bookadmin.modules.category.dto.CategoryForm;
import com.bookadmin.modules.category.entity.Category;
import com.bookadmin.modules.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public R<List<Category>> list() {
        return R.ok(categoryService.listCategories());
    }

    @PostMapping
    public R<Category> create(@Valid @RequestBody CategoryForm form) {
        return R.ok(categoryService.createCategory(form));
    }

    @PutMapping("/{id}")
    public R<Category> update(@PathVariable Long id, @Valid @RequestBody CategoryForm form) {
        return R.ok(categoryService.updateCategory(id, form));
    }

    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return R.ok();
    }
}
