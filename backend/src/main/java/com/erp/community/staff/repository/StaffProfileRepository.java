package com.erp.community.staff.repository;

import com.erp.community.staff.entity.StaffProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffProfileRepository extends JpaRepository<StaffProfile, Long> {
    Optional<StaffProfile> findByEmployeeId(Long employeeId);
}
