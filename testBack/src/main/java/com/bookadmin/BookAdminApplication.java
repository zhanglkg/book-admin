package com.bookadmin;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.bookadmin.modules.**.mapper")
public class BookAdminApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookAdminApplication.class, args);
    }
}
