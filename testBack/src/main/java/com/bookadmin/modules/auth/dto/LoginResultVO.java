package com.bookadmin.modules.auth.dto;

import lombok.Data;

/**
 * 登录返回 { token, userInfo },对应前端 LoginResult。
 */
@Data
public class LoginResultVO {

    private String token;
    private UserInfoVO userInfo;

    public LoginResultVO(String token, UserInfoVO userInfo) {
        this.token = token;
        this.userInfo = userInfo;
    }
}
