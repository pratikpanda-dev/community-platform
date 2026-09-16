package com.erp.community.complaint.service;

import com.erp.community.complaint.entity.Complaint;
import com.erp.community.security.AuthUser;

import java.util.List;

public interface ComplaintService {
    void createComplaint(AuthUser user, Complaint complaint);
    List<Complaint> getComplaints(AuthUser user, String status);
    Complaint updateStatus(Long id, String newStatus);
}