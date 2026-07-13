package com.bookadmin.common.result;

/**
 * 业务异常,由全局异常处理器转换为 { code, message }。
 */
public class BizException extends RuntimeException {

    private final int code;

    public BizException(String message) {
        super(message);
        this.code = 1;
    }

    public BizException(int code, String message) {
        super(message);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
