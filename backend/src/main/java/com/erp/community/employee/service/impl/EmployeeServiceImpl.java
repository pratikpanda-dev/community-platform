package com.erp.community.employee.service.impl;

import com.erp.community.dto.LoginResponse;
import com.erp.community.employee.entity.Employee;
import com.erp.community.employee.entity.Role;
import com.erp.community.employee.repository.EmployeeRepository;
import com.erp.community.employee.service.EmployeeService;
import com.erp.community.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Employee createEmployee(Employee employee) {
        if (employee.getRole() == Role.RESIDENT) {
            employee.setDepartment(null);
            employee.setJobTitle(null);
            employee.setSalary(null);
        }
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee findEmployeeById(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee Not Found for Id: " +id));
    }

    @Override
    public Employee updateEmployee(Long id, Employee updateEmployee) {

        Employee employee = findEmployeeById(id);
        employee.setName(updateEmployee.getName());
        employee.setEmail(updateEmployee.getEmail());
        employee.setDepartment(updateEmployee.getDepartment());
        employee.setJobTitle(updateEmployee.getJobTitle());
        employee.setSalary(updateEmployee.getSalary());

        return employeeRepository.save(employee);
    }

    @Override
    public void deleteEmployeeById(Long id) {

        employeeRepository.deleteById(id);
    }

    @Override
    public LoginResponse login(String email, String rawPassword) {

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, employee.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                employee.getEmail(),
                employee.getId(),
                employee.getSociety().getId(),
                employee.getRole(),
                employee.getName()
        );
        return new LoginResponse(token, employee.getEmail());
    }

    @Override
    public List<Employee> getAllEmployees(Long societyId) {
        return employeeRepository.findBySocietyId(societyId);
    }
}
