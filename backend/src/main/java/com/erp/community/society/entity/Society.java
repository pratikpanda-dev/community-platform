package com.erp.community.society.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "societies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Society {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    @Column(name = "plan_type")
    private String planType; // e.g. "FREE", "PAID" — keep as a plain String for now

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}