package com.bookadmin.modules.auth.controller;

import com.bookadmin.common.result.R;
import com.bookadmin.modules.auth.dto.LoginParams;
import com.bookadmin.modules.auth.dto.LoginResultVO;
import com.bookadmin.modules.auth.dto.UserInfoVO;
import com.bookadmin.modules.auth.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AccountService accountService;

    @PostMapping("/login")
    public R<LoginResultVO> login(@Valid @RequestBody LoginParams params) {
        return R.ok(accountService.login(params));
    }

    @GetMapping("/profile")
    public R<UserInfoVO> profile() {
        return R.ok(accountService.profile());
    }
}
