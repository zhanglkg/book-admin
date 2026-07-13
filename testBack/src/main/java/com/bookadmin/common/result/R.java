package com.bookadmin.common.result;

import lombok.Data;

/**
 * 统一响应信封,与前端 src/types/api.ts 中的 ApiResponse 严格对应:
 * { code, data, message } (code === 0 视为成功)
 */
@Data
public class R<T> {

    /** 0 = 成功;1 = 业务失败;401 = 未认证 */
    private int code;
    private T data;
    private String message;

    public R() {
    }

    public R(int code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public static <T> R<T> ok(T data) {
        return new R<>(0, data, "success");
    }

    public static <T> R<T> ok() {
        return new R<>(0, null, "success");
    }

    public static <T> R<T> fail(String message) {
        return new R<>(1, null, message);
    }

    public static <T> R<T> fail(int code, String message) {
        return new R<>(code, null, message);
    }
}
