package com.erp.community.complaint.service.impl;

import com.erp.community.complaint.entity.Complaint;
import com.erp.community.complaint.repository.ComplaintRepository;
import com.erp.community.complaint.service.ComplaintService;
import com.erp.community.employee.entity.Employee;
import com.erp.community.employee.entity.Role;
import com.erp.community.security.AuthUser;
import com.erp.community.society.entity.Society;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    private static final List<String> STATUS_ORDER = List.of("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED");

    @Override
    public void createComplaint(AuthUser user, Complaint complaint) {
        Employee raisedBy = new Employee();
        raisedBy.setId(user.getEmployeeId());

        Society society = new Society();
        society.setId(user.getSocietyId());

        complaint.setRaisedBy(raisedBy);
        complaint.setSociety(society);
        complaint.setStatus("OPEN");
        complaint.setCreatedAt(LocalDateTime.now());

        complaintRepository.save(complaint);
    }

    @Override
    public List<Complaint> getComplaints(AuthUser user, String status) {
        boolean isAdmin = user.getRole() == Role.ADMIN;

        List<Complaint> results;
        if (isAdmin) {
            results = (status != null)
                    ? complaintRepository.findBySocietyIdAndStatus(user.getSocietyId(), status)
                    : complaintRepository.findBySocietyId(user.getSocietyId());
        } else {
            results = complaintRepository.findByRaisedById(user.getEmployeeId());
            if (status != null) {
                results = results.stream().filter(c -> c.getStatus().equals(status)).toList();
            }
        }
        return results;
    }

    @Override
    public Complaint updateStatus(Long id, String newStatus) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        int currentIndex = STATUS_ORDER.indexOf(complaint.getStatus());
        int newIndex = STATUS_ORDER.indexOf(newStatus);

        if (newIndex == -1) {
            throw new RuntimeException("Invalid status: " + newStatus);
        }
        if (newIndex <= currentIndex) {
            throw new RuntimeException("Cannot move status backward from " + complaint.getStatus() + " to " + newStatus);
        }

        complaint.setStatus(newStatus);
        return complaintRepository.save(complaint);
    }
}