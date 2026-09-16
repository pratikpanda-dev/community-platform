package com.erp.community.staff.service.impl;

import com.erp.community.staff.entity.Attendance;
import com.erp.community.staff.entity.StaffProfile;
import com.erp.community.staff.repository.AttendanceRepository;
import com.erp.community.staff.repository.StaffProfileRepository;
import com.erp.community.staff.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private StaffProfileRepository staffProfileRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Override
    public Attendance checkIn(Long employeeId) {
        StaffProfile staffProfile = staffProfileRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("This employee has no staff profile"));

        LocalDate today = LocalDate.now();

        boolean alreadyCheckedIn = attendanceRepository
                .findByStaffProfileIdAndAttendanceDate(staffProfile.getId(), today)
                .isPresent();

        if (alreadyCheckedIn) {
            throw new RuntimeException("Already checked in today");
        }

        Attendance attendance = new Attendance();
        attendance.setStaffProfile(staffProfile);
        attendance.setAttendanceDate(today);
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus("PRESENT");

        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance checkOut(Long employeeId) {
        StaffProfile staffProfile = staffProfileRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("This employee has no staff profile"));

        Attendance attendance = attendanceRepository
                .findByStaffProfileIdAndAttendanceDate(staffProfile.getId(), LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No check-in found for today"));

        attendance.setCheckOutTime(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getTodaySummary(Long employeeId, Long societyId, boolean isAdmin) {
        LocalDate today = LocalDate.now();

        if (isAdmin) {
            return attendanceRepository.findByAttendanceDateAndStaffProfileEmployeeSocietyId(today, societyId);
        }

        return attendanceRepository.findByAttendanceDateAndStaffProfileEmployeeId(today, employeeId)
                .map(List::of)
                .orElseGet(List::of);
    }
}
