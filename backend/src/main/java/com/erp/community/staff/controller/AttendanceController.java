package com.erp.community.staff.controller;

import com.erp.community.staff.entity.Attendance;
import com.erp.community.staff.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(@RequestParam Long employeeId) {
        try {
            return ResponseEntity.ok(attendanceService.checkIn(employeeId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(@RequestParam Long employeeId) {
        try {
            return ResponseEntity.ok(attendanceService.checkOut(employeeId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<List<Attendance>> getTodaySummary() {
        return ResponseEntity.ok(attendanceService.getTodaySummary());
    }
}