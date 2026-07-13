package com.bookadmin.modules.book.controller;

import com.bookadmin.common.page.PageResult;
import com.bookadmin.common.result.R;
import com.bookadmin.modules.book.dto.BookForm;
import com.bookadmin.modules.book.dto.BookQuery;
import com.bookadmin.modules.book.entity.Book;
import com.bookadmin.modules.book.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public R<PageResult<Book>> list(BookQuery query) {
        return R.ok(bookService.pageBooks(query));
    }

    @GetMapping("/{id}")
    public R<Book> get(@PathVariable Long id) {
        return R.ok(bookService.getBook(id));
    }

    @PostMapping
    public R<Book> create(@Valid @RequestBody BookForm form) {
        return R.ok(bookService.createBook(form));
    }

    @PutMapping("/{id}")
    public R<Book> update(@PathVariable Long id, @Valid @RequestBody BookForm form) {
        return R.ok(bookService.updateBook(id, form));
    }

    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        bookService.deleteBook(id);
        return R.ok();
    }
}
