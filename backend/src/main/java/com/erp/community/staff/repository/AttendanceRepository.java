package com.erp.community.staff.repository;

import com.erp.community.staff.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStaffProfileIdAndAttendanceDate(Long staffProfileId, LocalDate date);
    List<Attendance> findByAttendanceDate(LocalDate date);
}