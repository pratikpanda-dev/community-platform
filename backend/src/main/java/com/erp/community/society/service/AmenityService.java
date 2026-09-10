package com.erp.community.society.service;

import com.erp.community.society.dto.SlotDTO;

import java.time.LocalDate;
import java.util.List;

public interface AmenityService {
    List<SlotDTO> getAvailability(Long amenityId, LocalDate date);
}
