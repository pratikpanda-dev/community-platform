package com.erp.community.complaint.service.impl;

import com.erp.community.complaint.entity.Complaint;
import com.erp.community.complaint.repository.ComplaintRepository;
import com.erp.community.complaint.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Override
    public void createComplaint(Complaint complaint) {
        complaint.setStatus("OPEN");
        complaint.setCreatedAt(LocalDateTime.now());
        complaintRepository.save(complaint);
    }

    @Override
    public List<Complaint> getComplaints(Long societyId, String status, Long assignedTo) {
        if (status != null) {
            return complaintRepository.findBySocietyIdAndStatus(societyId, status);
        }
        if (assignedTo != null) {
            return complaintRepository.findBySocietyIdAndAssignedToId(societyId, assignedTo);
        }
        return complaintRepository.findBySocietyId(societyId);
    }

    @Override
    public Complaint updateStatus(Long id, String status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }
}