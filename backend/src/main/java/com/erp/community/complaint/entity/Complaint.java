package com.erp.community.complaint.entity;

import com.erp.community.employee.entity.Employee;
import com.erp.community.society.entity.Society;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @ManyToOne
    @JoinColumn(name = "raised_by_id", nullable = false)
    private Employee raisedBy;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private Employee assignedTo;

    @Column(nullable = false)
    private String category; // "PLUMBING", "ELECTRICAL", "SECURITY", "OTHER"

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH

    @Column(nullable = false)
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}