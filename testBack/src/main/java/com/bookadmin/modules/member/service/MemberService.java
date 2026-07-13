package com.bookadmin.modules.member.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookadmin.common.page.PageResult;
import com.bookadmin.common.result.BizException;
import com.bookadmin.modules.member.dto.MemberForm;
import com.bookadmin.modules.member.dto.MemberQuery;
import com.bookadmin.modules.member.entity.Member;
import com.bookadmin.modules.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;

    public PageResult<Member> pageMembers(MemberQuery q) {
        long page = q.getPage() == null ? 1 : q.getPage();
        long size = q.getPageSize() == null ? 10 : q.getPageSize();
        Page<Member> ipage = memberMapper.selectMemberPage(new Page<>(page, size), q);
        return PageResult.of(ipage.getRecords(), ipage.getTotal(), page, size);
    }

    public Member createMember(MemberForm form) {
        Member member = new Member();
        BeanUtils.copyProperties(form, member);
        member.setBorrowCount(0);
        member.setCreatedAt(LocalDateTime.now());
        memberMapper.insert(member);
        return member;
    }

    public Member updateMember(Long id, MemberForm form) {
        if (memberMapper.selectById(id) == null) {
            throw new BizException("会员不存在");
        }
        Member member = new Member();
        BeanUtils.copyProperties(form, member);
        member.setId(id);
        memberMapper.updateById(member);
        return memberMapper.selectById(id);
    }

    public void deleteMember(Long id) {
        if (memberMapper.selectById(id) == null) {
            throw new BizException("会员不存在");
        }
        memberMapper.deleteById(id);
    }
}
