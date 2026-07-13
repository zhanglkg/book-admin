package com.bookadmin.modules.auth.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 当前登录用户信息,字段名与前端 src/types/user.ts 的 UserInfo 严格对应。
 */
@Data
public class UserInfoVO {

    private Long id;
    private String username;
    private String nickname;
    private String avatar;
    private String email;
    private String phone;
    private String role;
    private String roleName;
    private String status;
    private List<String> permissions;
    private LocalDateTime createdAt;
}
