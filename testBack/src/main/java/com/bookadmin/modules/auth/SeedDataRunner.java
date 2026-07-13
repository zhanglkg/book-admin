package com.bookadmin.modules.auth;

import com.bookadmin.modules.auth.entity.Account;
import com.bookadmin.modules.auth.mapper.AccountMapper;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 演示账号初始化:库内无账号时写入 admin / librarian (密码 123456,BCrypt 加密)。
 * 使用 INSERT IGNORE 思路(selectCount 判断),保证可重复启动。
 */
@Component
public class SeedDataRunner implements ApplicationRunner {

    private final AccountMapper accountMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public SeedDataRunner(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (accountMapper.selectCount(null) > 0) {
            return;
        }
        accountMapper.insert(build("admin", "系统管理员", "超级管理员", "admin", "admin@book-admin.com", "13800008888"));
        accountMapper.insert(build("librarian", "图书管理员", "图书管理员", "librarian", "librarian@book-admin.com", "13800009999"));
    }

    private Account build(String username, String nickname, String roleName, String roleCode,
                          String email, String phone) {
        Account account = new Account();
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode("123456"));
        account.setNickname(nickname);
        account.setAvatar("");
        account.setEmail(email);
        account.setPhone(phone);
        account.setRoleCode(roleCode);
        account.setRoleName(roleName);
        account.setStatus("active");
        account.setCreatedAt(LocalDateTime.now());
        return account;
    }
}
