package com.erp.community.staff.controller;

import com.erp.community.employee.entity.Employee;
import com.erp.community.employee.repository.EmployeeRepository;
import com.erp.community.staff.entity.StaffProfile;
import com.erp.community.staff.repository.StaffProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff-profiles")
public class StaffProfileController {

    @Autowired
    private StaffProfileRepository staffProfileRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<StaffProfile> create(@RequestBody StaffProfile request) {
        Long employeeId = request.getEmployee().getId();
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        StaffProfile profile = staffProfileRepository.findByEmployeeId(employeeId)
                .orElseGet(StaffProfile::new);
        profile.setEmployee(employee);
        profile.setStaffType(request.getStaffType());
        profile.setShiftStart(request.getShiftStart());
        profile.setShiftEnd(request.getShiftEnd());

        return ResponseEntity.ok(staffProfileRepository.save(profile));
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<StaffProfile> getByEmployeeId(@PathVariable Long employeeId) {
        return staffProfileRepository.findByEmployeeId(employeeId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
