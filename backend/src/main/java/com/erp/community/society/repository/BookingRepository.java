package com.erp.community.society.repository;

import com.erp.community.society.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByAmenityIdAndBookingDate(Long amenityId, LocalDate bookingDate);
    List<Booking> findByBookedByIdOrderByBookingDateAscStartTimeAsc(Long userId);
}
