package com.erp.community.config;

import com.erp.community.employee.entity.Employee;
import com.erp.community.employee.entity.Role;
import com.erp.community.employee.repository.EmployeeRepository;
import com.erp.community.society.entity.Society;
import com.erp.community.society.repository.SocietyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// One-time bootstrap for the first admin account on a fresh uat database.
// Safe to redeploy: skips creation once an employee with this email exists.
@Component
@Profile("uat")
public class AdminBootstrapSeeder implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "pratik@community.uat";

    private final EmployeeRepository employeeRepository;
    private final SocietyRepository societyRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminBootstrapSeeder(EmployeeRepository employeeRepository,
                                 SocietyRepository societyRepository,
                                 PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.societyRepository = societyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (employeeRepository.findByEmail(ADMIN_EMAIL).isPresent()) {
            return;
        }

        Society society = new Society();
        society.setName("Default Society");
        society = societyRepository.save(society);

        Employee admin = new Employee();
        admin.setName("Pratik Panda");
        admin.setEmail(ADMIN_EMAIL);
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setRole(Role.ADMIN);
        admin.setSociety(society);
        employeeRepository.save(admin);
    }
}
