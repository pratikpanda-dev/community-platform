package com.erp.community.security;

import com.erp.community.employee.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthUser {
    private String email;
    private Long employeeId;
    private Long societyId;
    private Role role;
}