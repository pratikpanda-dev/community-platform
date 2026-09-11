package com.erp.community.complaint.repository;

import com.erp.community.complaint.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findBySocietyId(Long societyId);
    List<Complaint> findBySocietyIdAndStatus(Long societyId, String status);
    List<Complaint> findBySocietyIdAndAssignedToId(Long societyId, Long assignedToId);
}