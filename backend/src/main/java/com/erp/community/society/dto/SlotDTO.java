package com.erp.community.society.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class SlotDTO {
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean available;
}
