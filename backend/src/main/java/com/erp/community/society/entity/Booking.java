package com.erp.community.society.entity;

import com.erp.community.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_amenity_slot",
                columnNames = {"amenity_id", "booking_date", "start_time"}
        ))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "amenity_id", nullable = false)
    private Amenity amenity;

    @ManyToOne
    @JoinColumn(name = "booked_by_user_id", nullable = false)
    private Employee bookedBy;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String status = "CONFIRMED"; // CONFIRMED, CANCELLED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}