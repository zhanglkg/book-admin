package com.bookadmin.security;

import com.bookadmin.common.result.R;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * JWT 拦截器:校验除 /auth/login 外所有请求的 Bearer Token。
 * 未认证时直接写回 { code:401, ... } (HTTP 200,与前端 Mock 行为一致)。
 */
@Component
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 放行登录接口与 CORS 预检
        String uri = request.getRequestURI();
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || uri.endsWith("/auth/login")) {
            return true;
        }

        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            writeUnauthorized(response);
            return false;
        }

        try {
            Long userId = jwtUtil.parseUserId(auth.substring(7));
            UserContext.setUserId(userId);
            return true;
        } catch (Exception e) {
            writeUnauthorized(response);
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        UserContext.clear();
    }

    private void writeUnauthorized(HttpServletResponse response) throws Exception {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        R<Void> result = R.fail(401, "未登录或登录已过期");
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
