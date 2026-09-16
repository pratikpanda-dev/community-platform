package com.erp.community.visitor.entity;

import com.erp.community.employee.entity.Employee;
import com.erp.community.society.entity.Society;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_passes")
@Data
@NoArgsConstructor
public class VisitorPass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "resident_id", nullable = false)
    private Employee resident;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @Column(name = "visitor_name", nullable = false)
    private String visitorName;

    @Column(name = "visitor_phone", nullable = false)
    private String visitorPhone;

    @Column(nullable = false)
    private String purpose;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "pass_code", nullable = false, unique = true, updatable = false)
    private String passCode;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
