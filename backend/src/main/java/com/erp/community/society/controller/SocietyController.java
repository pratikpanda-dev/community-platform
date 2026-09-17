package com.erp.community.society.controller;

import com.erp.community.society.entity.Society;
import com.erp.community.society.repository.SocietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/societies")
public class SocietyController {

    @Autowired
    private SocietyRepository societyRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Society> create(@RequestBody Society society) {
        society.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(societyRepository.save(society));
    }

    @GetMapping
    public ResponseEntity<Iterable<Society>> getAll() {
        return ResponseEntity.ok(societyRepository.findAll());
    }
}