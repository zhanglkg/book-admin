package com.bookadmin.modules.system.controller;

import com.bookadmin.common.result.R;
import com.bookadmin.modules.auth.dto.PermissionUpdateDTO;
import com.bookadmin.modules.auth.dto.RoleVO;
import com.bookadmin.modules.auth.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/system")
@RequiredArgsConstructor
public class SystemController {

    private final AccountService accountService;

    @GetMapping("/roles")
    public R<List<RoleVO>> roles() {
        return R.ok(accountService.listRoles());
    }

    @PutMapping("/roles/{id}/permissions")
    public R<RoleVO> updatePermissions(@PathVariable Long id,
                                       @RequestBody PermissionUpdateDTO body) {
        return R.ok(accountService.updateRolePermissions(id, body.getPermissions()));
    }
}
