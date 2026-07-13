package com.bookadmin.modules.borrow.controller;

import com.bookadmin.common.page.PageResult;
import com.bookadmin.common.result.R;
import com.bookadmin.modules.borrow.dto.BorrowForm;
import com.bookadmin.modules.borrow.dto.BorrowQuery;
import com.bookadmin.modules.borrow.entity.BorrowRecord;
import com.bookadmin.modules.borrow.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/borrows")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @GetMapping
    public R<PageResult<BorrowRecord>> list(BorrowQuery query) {
        return R.ok(borrowService.pageBorrows(query));
    }

    @PostMapping
    public R<BorrowRecord> borrow(@RequestBody BorrowForm form) {
        return R.ok(borrowService.borrowBook(form));
    }

    @PutMapping("/{id}/return")
    public R<BorrowRecord> returnBook(@PathVariable Long id) {
        return R.ok(borrowService.returnBook(id));
    }
}
