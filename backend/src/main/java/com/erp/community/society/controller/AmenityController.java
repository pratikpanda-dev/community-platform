package com.erp.community.society.controller;

import com.erp.community.society.dto.SlotDTO;
import com.erp.community.society.entity.Amenity;
import com.erp.community.society.repository.AmenityRepository;
import com.erp.community.society.service.AmenityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/amenities")
@CrossOrigin(origins = "http://localhost:5173")
public class AmenityController {

    @Autowired
    private AmenityService amenityService;

    @Autowired
    private AmenityRepository amenityRepository;

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<SlotDTO>> getAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(amenityService.getAvailability(id, date));
    }

    @GetMapping
    public ResponseEntity<List<Amenity>> getAmenities(@RequestParam Long societyId) {
        return ResponseEntity.ok(amenityRepository.findBySocietyId(societyId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Amenity> create(@RequestBody Amenity amenity) {
        return ResponseEntity.ok(amenityRepository.save(amenity));
    }
}
