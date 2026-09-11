package com.erp.community.complaint.controller;

import com.erp.community.complaint.entity.Complaint;
import com.erp.community.complaint.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Void> create(@RequestBody Complaint complaint) {
        complaintService.createComplaint(complaint);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAll(
            @RequestParam Long societyId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long assignedTo) {
        return ResponseEntity.ok(complaintService.getComplaints(societyId, status, assignedTo));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(complaintService.updateStatus(id, body.get("status")));
    }
}