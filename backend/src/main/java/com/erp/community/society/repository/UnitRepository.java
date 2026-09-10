package com.erp.community.society.repository;

import com.erp.community.society.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnitRepository extends JpaRepository<Unit, Long> {
    List<Unit> findBySocietyId(Long societyId);
}