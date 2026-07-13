package com.bookadmin.modules.auth.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 登录账号(管理员 / 图书管理员),与前端 UserInfo 对应。
 */
@Data
@TableName("account")
public class Account {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private String avatar;
    private String email;
    private String phone;
    private String roleCode;
    private String roleName;
    private String status;
    private LocalDateTime createdAt;
}
