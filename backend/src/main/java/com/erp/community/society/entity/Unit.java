package com.erp.community.society.entity;

import com.erp.community.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "units")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "block_name")
    private String block;

    @Column(name = "flat_no", nullable = false)
    private String flatNo;

    @ManyToOne
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @ManyToOne
    @JoinColumn(name = "owner_user_id")
    private Employee ownerUser;

    @ManyToOne
    @JoinColumn(name = "tenant_user_id")
    private Employee tenantUser;
}
