package com.erp.community.visitor.repository;

import com.erp.community.visitor.entity.VisitorPass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitorPassRepository extends JpaRepository<VisitorPass, Long> {
    List<VisitorPass> findByResidentIdOrderByVisitDateDescCreatedAtDesc(Long residentId);
    List<VisitorPass> findBySocietyIdOrderByVisitDateDescCreatedAtDesc(Long societyId);
}
