package com.bookadmin.modules.auth.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 角色与权限,permissions 以逗号分隔存储,返回前端时转换为字符串数组。
 */
@Data
@TableName("role")
public class Role {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String code;
    private String description;
    private String permissions;
    private LocalDateTime createdAt;
}
