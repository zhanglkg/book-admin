package com.bookadmin.modules.auth.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bookadmin.modules.auth.entity.Role;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoleMapper extends BaseMapper<Role> {
}
