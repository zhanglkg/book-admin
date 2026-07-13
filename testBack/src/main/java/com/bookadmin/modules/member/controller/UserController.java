package com.bookadmin.modules.member.controller;

import com.bookadmin.common.page.PageResult;
import com.bookadmin.common.result.R;
import com.bookadmin.modules.member.dto.MemberForm;
import com.bookadmin.modules.member.dto.MemberQuery;
import com.bookadmin.modules.member.entity.Member;
import com.bookadmin.modules.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final MemberService memberService;

    @GetMapping
    public R<PageResult<Member>> list(MemberQuery query) {
        return R.ok(memberService.pageMembers(query));
    }

    @PostMapping
    public R<Member> create(@RequestBody MemberForm form) {
        return R.ok(memberService.createMember(form));
    }

    @PutMapping("/{id}")
    public R<Member> update(@PathVariable Long id, @RequestBody MemberForm form) {
        return R.ok(memberService.updateMember(id, form));
    }

    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        memberService.deleteMember(id);
        return R.ok();
    }
}
