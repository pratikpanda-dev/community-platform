package com.erp.community.society.service.impl;

import com.erp.community.employee.entity.Employee;
import com.erp.community.employee.repository.EmployeeRepository;
import com.erp.community.society.dto.BookingRequest;
import com.erp.community.society.entity.Amenity;
import com.erp.community.society.entity.Booking;
import com.erp.community.society.repository.AmenityRepository;
import com.erp.community.society.repository.BookingRepository;
import com.erp.community.society.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public Booking createBooking(BookingRequest request) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        boolean bookingIsInPast = request.getBookingDate().isBefore(today)
                || (request.getBookingDate().isEqual(today) && !request.getStartTime().isAfter(now));

        if (bookingIsInPast) {
            throw new RuntimeException("Past dates and time slots cannot be booked");
        }

        Amenity amenity = amenityRepository.findById(request.getAmenityId())
                .orElseThrow(() -> new RuntimeException("Amenity not found"));

        Employee bookedBy = employeeRepository.findById(request.getBookedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalTime endTime = request.getStartTime().plusMinutes(amenity.getSlotDurationMins());

        Booking booking = new Booking();
        booking.setAmenity(amenity);
        booking.setBookedBy(bookedBy);
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(endTime);
        booking.setStatus("CONFIRMED");

        try {
            return bookingRepository.save(booking);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("This slot was just booked by someone else. Please choose another.");
        }
    }

    @Override
    public List<Booking> getMyBookings(Long userId) {
        return bookingRepository.findByBookedByIdOrderByBookingDateAscStartTimeAsc(userId);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }
}
