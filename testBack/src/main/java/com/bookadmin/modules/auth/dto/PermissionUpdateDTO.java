package com.bookadmin.modules.auth.dto;

import lombok.Data;

import java.util.List;

@Data
public class PermissionUpdateDTO {

    private List<String> permissions;
}
