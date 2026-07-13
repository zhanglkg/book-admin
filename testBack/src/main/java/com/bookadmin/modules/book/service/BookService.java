package com.bookadmin.modules.book.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookadmin.common.page.PageResult;
import com.bookadmin.common.result.BizException;
import com.bookadmin.modules.book.dto.BookForm;
import com.bookadmin.modules.book.dto.BookQuery;
import com.bookadmin.modules.book.entity.Book;
import com.bookadmin.modules.book.mapper.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookMapper bookMapper;

    public PageResult<Book> pageBooks(BookQuery q) {
        long page = q.getPage() == null ? 1 : q.getPage();
        long size = q.getPageSize() == null ? 10 : q.getPageSize();
        Page<Book> ipage = bookMapper.selectBookPage(new Page<>(page, size), q);
        return PageResult.of(ipage.getRecords(), ipage.getTotal(), page, size);
    }

    public Book getBook(Long id) {
        Book book = bookMapper.selectBookById(id);
        if (book == null) {
            throw new BizException("图书不存在");
        }
        return book;
    }

    public Book createBook(BookForm form) {
        Book book = new Book();
        BeanUtils.copyProperties(form, book);
        book.setCreatedAt(LocalDateTime.now());
        bookMapper.insert(book);
        return getBook(book.getId());
    }

    public Book updateBook(Long id, BookForm form) {
        if (bookMapper.selectById(id) == null) {
            throw new BizException("图书不存在");
        }
        Book book = new Book();
        BeanUtils.copyProperties(form, book);
        book.setId(id);
        bookMapper.updateById(book);
        return getBook(id);
    }

    public void deleteBook(Long id) {
        if (bookMapper.selectById(id) == null) {
            throw new BizException("图书不存在");
        }
        bookMapper.deleteById(id);
    }
}
