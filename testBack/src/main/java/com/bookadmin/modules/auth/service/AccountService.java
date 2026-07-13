package com.bookadmin.modules.auth.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.bookadmin.common.result.BizException;
import com.bookadmin.modules.auth.dto.*;
import com.bookadmin.modules.auth.entity.Account;
import com.bookadmin.modules.auth.entity.Role;
import com.bookadmin.modules.auth.mapper.AccountMapper;
import com.bookadmin.modules.auth.mapper.RoleMapper;
import com.bookadmin.security.JwtUtil;
import com.bookadmin.security.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountMapper accountMapper;
    private final RoleMapper roleMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public LoginResultVO login(LoginParams params) {
        Account account = accountMapper.selectOne(
                Wrappers.<Account>lambdaQuery().eq(Account::getUsername, params.getUsername()));
        if (account == null || !passwordEncoder.matches(params.getPassword(), account.getPassword())) {
            throw new BizException("用户名或密码错误");
        }
        if (!"active".equals(account.getStatus())) {
            throw new BizException("账号已被禁用");
        }
        String token = jwtUtil.generateToken(account.getId());
        return new LoginResultVO(token, toUserInfo(account));
    }

    public UserInfoVO profile() {
        Long userId = UserContext.getUserId();
        Account account = accountMapper.selectById(userId);
        if (account == null) {
            throw new BizException(401, "未登录或登录已过期");
        }
        return toUserInfo(account);
    }

    public List<RoleVO> listRoles() {
        return roleMapper.selectList(Wrappers.emptyWrapper()).stream()
                .map(RoleVO::from)
                .toList();
    }

    public RoleVO updateRolePermissions(Long id, List<String> permissions) {
        Role role = roleMapper.selectById(id);
        if (role == null) {
            throw new BizException("角色不存在");
        }
        role.setPermissions(permissions == null ? "" : String.join(",", permissions));
        roleMapper.updateById(role);
        return RoleVO.from(role);
    }

    private UserInfoVO toUserInfo(Account account) {
        Role role = roleMapper.selectOne(
                Wrappers.<Role>lambdaQuery().eq(Role::getCode, account.getRoleCode()));
        List<String> permissions = (role == null || role.getPermissions() == null)
                ? List.of()
                : Arrays.stream(role.getPermissions().split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).toList();
        UserInfoVO vo = new UserInfoVO();
        vo.setId(account.getId());
        vo.setUsername(account.getUsername());
        vo.setNickname(account.getNickname());
        vo.setAvatar(account.getAvatar());
        vo.setEmail(account.getEmail());
        vo.setPhone(account.getPhone());
        vo.setRole(account.getRoleCode());
        vo.setRoleName(account.getRoleName());
        vo.setStatus(account.getStatus());
        vo.setPermissions(permissions);
        vo.setCreatedAt(account.getCreatedAt());
        return vo;
    }
}
