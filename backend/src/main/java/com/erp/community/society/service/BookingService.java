package com.erp.community.society.service;

import com.erp.community.society.dto.BookingRequest;
import com.erp.community.society.entity.Booking;

import java.util.List;

public interface BookingService {
    Booking createBooking(BookingRequest request);
    List<Booking> getMyBookings(Long userId);
    void cancelBooking(Long bookingId);
}
