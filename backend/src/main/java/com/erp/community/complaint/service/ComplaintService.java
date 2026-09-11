package com.erp.community.complaint.service;

import com.erp.community.complaint.entity.Complaint;

import java.util.List;

public interface ComplaintService {
    void createComplaint(Complaint complaint);
    List<Complaint> getComplaints(Long societyId, String status, Long assignedTo);
    Complaint updateStatus(Long id, String status);
}