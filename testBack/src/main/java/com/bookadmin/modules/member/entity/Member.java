package com.bookadmin.modules.member.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 会员/读者,与前端 src/types/user.ts 的 Member 对应。
 */
@Data
@TableName("member")
public class Member {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    private String nickname;
    private String avatar;
    private String email;
    private String phone;
    private String gender;
    private String status;
    private Integer borrowCount;
    private LocalDateTime createdAt;
}
