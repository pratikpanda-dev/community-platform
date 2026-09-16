package com.erp.community.complaint.controller;

import com.erp.community.complaint.entity.Complaint;
import com.erp.community.complaint.service.ComplaintService;
import com.erp.community.security.AuthUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<Void> create(Authentication authentication, @RequestBody Complaint complaint) {
        AuthUser user = (AuthUser) authentication.getPrincipal();
        complaintService.createComplaint(user, complaint);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAll(
            Authentication authentication,
            @RequestParam(required = false) String status) {
        AuthUser user = (AuthUser) authentication.getPrincipal();
        return ResponseEntity.ok(complaintService.getComplaints(user, status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(complaintService.updateStatus(id, body.get("status")));
    }
}