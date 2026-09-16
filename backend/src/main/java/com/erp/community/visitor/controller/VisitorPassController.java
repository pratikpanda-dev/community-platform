package com.erp.community.visitor.controller;

import com.erp.community.security.AuthUser;
import com.erp.community.employee.entity.Role;
import com.erp.community.visitor.dto.CreateVisitorPassRequest;
import com.erp.community.visitor.dto.VisitorPassResponse;
import com.erp.community.visitor.service.VisitorPassService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/visitor-passes")
public class VisitorPassController {

    private final VisitorPassService visitorPassService;

    public VisitorPassController(VisitorPassService visitorPassService) {
        this.visitorPassService = visitorPassService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateVisitorPassRequest request, Authentication authentication) {
        try {
            AuthUser currentUser = (AuthUser) authentication.getPrincipal();
            return ResponseEntity.status(HttpStatus.CREATED).body(VisitorPassResponse.from(visitorPassService.create(
                    currentUser.getEmployeeId(),
                    currentUser.getSocietyId(),
                    request
            )));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @GetMapping("/mine")
    public ResponseEntity<List<VisitorPassResponse>> getMine(Authentication authentication) {
        AuthUser currentUser = (AuthUser) authentication.getPrincipal();
        boolean isResident = currentUser.getRole() == Role.RESIDENT;

        return ResponseEntity.ok(
                (isResident
                        ? visitorPassService.getMine(currentUser.getEmployeeId())
                        : visitorPassService.getForSociety(currentUser.getSocietyId()))
                        .stream()
                        .map(VisitorPassResponse::from)
                        .toList()
        );
    }
}
