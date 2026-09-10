package com.erp.community.employee.service;

import com.erp.community.dto.LoginResponse;
import com.erp.community.employee.entity.Employee;

import java.util.List;

public interface EmployeeService {
    Employee createEmployee(Employee employee);
    List<Employee> findAll();
    Employee findEmployeeById(Long id);
    Employee updateEmployee(Long id, Employee updateEmployee);
    void deleteEmployeeById(Long id);
    LoginResponse login (String email, String rawPassword);

    List<Employee> getAllEmployees(Long societyId);
}
