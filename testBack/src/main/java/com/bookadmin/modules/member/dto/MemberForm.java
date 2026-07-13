package com.bookadmin.modules.member.dto;

import lombok.Data;

/**
 * 会员新增/编辑表单 (Partial<Member>)。
 */
@Data
public class MemberForm {

    private String username;
    private String nickname;
    private String avatar;
    private String email;
    private String phone;
    private String gender;
    private String status;
}
