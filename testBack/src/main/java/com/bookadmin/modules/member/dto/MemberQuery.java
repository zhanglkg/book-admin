package com.bookadmin.modules.member.dto;

import lombok.Data;

/**
 * 会员查询参数,对应前端 user.ts 的 getMembers 参数。
 */
@Data
public class MemberQuery {

    private Integer page = 1;
    private Integer pageSize = 10;
    private String keyword;
    private String status;
}
