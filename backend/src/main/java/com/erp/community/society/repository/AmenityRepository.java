package com.erp.community.society.repository;

import com.erp.community.society.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    List<Amenity> findBySocietyId(Long societyId);
}
