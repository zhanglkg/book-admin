package com.bookadmin.modules.auth.dto;

import com.bookadmin.modules.auth.entity.Role;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * 角色视图对象,permissions 转换为字符串数组,对应前端 Role。
 */
@Data
public class RoleVO {

    private Long id;
    private String name;
    private String code;
    private String description;
    private List<String> permissions;
    private LocalDateTime createdAt;

    public static RoleVO from(Role role) {
        RoleVO vo = new RoleVO();
        vo.setId(role.getId());
        vo.setName(role.getName());
        vo.setCode(role.getCode());
        vo.setDescription(role.getDescription());
        vo.setPermissions(role.getPermissions() == null ? List.of()
                : Arrays.stream(role.getPermissions().split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).toList());
        vo.setCreatedAt(role.getCreatedAt());
        return vo;
    }
}
