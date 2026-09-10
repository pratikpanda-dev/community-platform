package com.erp.community.society.service.impl;

import com.erp.community.society.dto.SlotDTO;
import com.erp.community.society.entity.Amenity;
import com.erp.community.society.entity.Booking;
import com.erp.community.society.repository.AmenityRepository;
import com.erp.community.society.repository.BookingRepository;
import com.erp.community.society.service.AmenityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AmenityServiceImpl implements AmenityService {

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public List<SlotDTO> getAvailability(Long amenityId, LocalDate date) {

        Amenity amenity = amenityRepository.findById(amenityId).orElseThrow(()-> new RuntimeException("Amenity not found"));

        List<Booking> existingBookings = bookingRepository.findByAmenityIdAndBookingDate(amenityId, date);
        List<SlotDTO> slots = new ArrayList<>();
        LocalTime current = amenity.getOpeningTime();

        while (current.plusMinutes(amenity.getSlotDurationMins()).compareTo(amenity.getClosingTime()) <= 0) {
            LocalTime slotEnd = current.plusMinutes(amenity.getSlotDurationMins());

            LocalTime finalCurrent = current;
            boolean isTaken = existingBookings.stream()
                    .anyMatch(b -> b.getStartTime().equals(finalCurrent) && !b.getStatus().equals("CANCELLED"));

            slots.add(new SlotDTO(current, slotEnd, !isTaken));
            current = slotEnd;
        }

        return slots;
    }
}
