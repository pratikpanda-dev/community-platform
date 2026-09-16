package com.erp.community.visitor.dto;

import com.erp.community.visitor.entity.VisitorPass;

import java.time.LocalDate;

public record VisitorPassResponse(
        Long id,
        String visitorName,
        String visitorPhone,
        String purpose,
        LocalDate visitDate,
        String passCode,
        String status,
        String residentName
) {
    public static VisitorPassResponse from(VisitorPass pass) {
        return new VisitorPassResponse(
                pass.getId(),
                pass.getVisitorName(),
                pass.getVisitorPhone(),
                pass.getPurpose(),
                pass.getVisitDate(),
                pass.getPassCode(),
                pass.getStatus(),
                pass.getResident().getName()
        );
    }
}
