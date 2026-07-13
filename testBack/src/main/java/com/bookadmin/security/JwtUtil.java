package com.bookadmin.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 工具:签发与解析 HS256 Token,载荷 subject 存放 userId。
 */
@Component
public class JwtUtil {

    private final JwtProperties properties;

    public JwtUtil(JwtProperties properties) {
        this.properties = properties;
    }

    private SecretKey key() {
        return Keys.hmacShaKeyFor(properties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 为用户生成 Token。
     */
    public String generateToken(Long userId) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + properties.getExpire() * 3600 * 1000L);
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key())
                .compact();
    }

    /**
     * 解析 Token 返回 userId,无效/过期则抛出异常。
     */
    public Long parseUserId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return Long.valueOf(claims.getSubject());
    }
}
