package com.bookadmin.modules.auth.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bookadmin.modules.auth.entity.Account;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountMapper extends BaseMapper<Account> {
}
