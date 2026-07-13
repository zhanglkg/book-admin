package com.bookadmin.modules.borrow.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookadmin.common.page.PageResult;
import com.bookadmin.common.result.BizException;
import com.bookadmin.modules.book.entity.Book;
import com.bookadmin.modules.book.mapper.BookMapper;
import com.bookadmin.modules.borrow.dto.BorrowForm;
import com.bookadmin.modules.borrow.dto.BorrowQuery;
import com.bookadmin.modules.borrow.entity.BorrowRecord;
import com.bookadmin.modules.borrow.mapper.BorrowRecordMapper;
import com.bookadmin.modules.member.entity.Member;
import com.bookadmin.modules.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final BorrowRecordMapper borrowMapper;
    private final BookMapper bookMapper;
    private final MemberMapper memberMapper;

    public PageResult<BorrowRecord> pageBorrows(BorrowQuery q) {
        long page = q.getPage() == null ? 1 : q.getPage();
        long size = q.getPageSize() == null ? 10 : q.getPageSize();
        Page<BorrowRecord> ipage = borrowMapper.selectBorrowPage(new Page<>(page, size), q);
        return PageResult.of(ipage.getRecords(), ipage.getTotal(), page, size);
    }

    @Transactional
    public BorrowRecord borrowBook(BorrowForm form) {
        Book book = bookMapper.selectById(form.getBookId());
        if (book == null) {
            throw new BizException("图书不存在");
        }
        if (book.getStock() == null || book.getStock() <= 0) {
            throw new BizException("库存不足");
        }
        Member member = memberMapper.selectById(form.getUserId());
        if (member == null) {
            throw new BizException("会员不存在");
        }

        BorrowRecord record = new BorrowRecord();
        record.setBookId(book.getId());
        record.setBookTitle(form.getBookTitle() != null ? form.getBookTitle() : book.getTitle());
        record.setBookCover(book.getCover());
        record.setUserId(member.getId());
        record.setUserName(form.getUserName() != null ? form.getUserName() : member.getNickname());
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(form.getDueDate());
        record.setReturnDate(null);
        record.setStatus("borrowing");
        borrowMapper.insert(record);

        book.setStock(book.getStock() - 1);
        bookMapper.updateById(book);
        member.setBorrowCount((member.getBorrowCount() == null ? 0 : member.getBorrowCount()) + 1);
        memberMapper.updateById(member);
        return record;
    }

    @Transactional
    public BorrowRecord returnBook(Long id) {
        BorrowRecord record = borrowMapper.selectById(id);
        if (record == null) {
            throw new BizException("借阅记录不存在");
        }
        if ("returned".equals(record.getStatus())) {
            throw new BizException("该记录已归还");
        }
        record.setReturnDate(LocalDate.now());
        record.setStatus("returned");
        borrowMapper.updateById(record);

        Book book = bookMapper.selectById(record.getBookId());
        if (book != null) {
            book.setStock((book.getStock() == null ? 0 : book.getStock()) + 1);
            bookMapper.updateById(book);
        }
        Member member = memberMapper.selectById(record.getUserId());
        if (member != null) {
            int count = member.getBorrowCount() == null ? 0 : member.getBorrowCount();
            member.setBorrowCount(Math.max(0, count - 1));
            memberMapper.updateById(member);
        }
        return record;
    }
}
