package com.erp.community.society.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    private Long amenityId;
    private Long bookedByUserId;
    private LocalDate bookingDate;
    private LocalTime startTime;
}