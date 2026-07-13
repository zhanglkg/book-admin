package com.bookadmin.modules.member.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bookadmin.modules.member.dto.MemberQuery;
import com.bookadmin.modules.member.entity.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MemberMapper extends BaseMapper<Member> {

    @Select("<script>" +
            "SELECT * FROM member " +
            "<where>" +
            "  <if test='q.keyword != null and q.keyword != \"\"'>" +
            "    AND (nickname LIKE CONCAT('%', #{q.keyword}, '%') " +
            "      OR username LIKE CONCAT('%', #{q.keyword}, '%') " +
            "      OR phone LIKE CONCAT('%', #{q.keyword}, '%'))" +
            "  </if>" +
            "  <if test='q.status != null and q.status != \"\"'>AND status = #{q.status}</if>" +
            "</where>" +
            "ORDER BY id DESC" +
            "</script>")
    Page<Member> selectMemberPage(Page<Member> page, @Param("q") MemberQuery q);
}
