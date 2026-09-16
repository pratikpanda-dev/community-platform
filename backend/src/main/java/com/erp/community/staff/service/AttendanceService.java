package com.erp.community.staff.service;

import com.erp.community.staff.entity.Attendance;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    Attendance checkIn(Long employeeId);
    Attendance checkOut(Long employeeId);
    List<Attendance> getTodaySummary(Long employeeId, Long societyId, boolean isAdmin);
}
