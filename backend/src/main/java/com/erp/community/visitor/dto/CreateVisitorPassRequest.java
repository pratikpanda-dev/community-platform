package com.erp.community.visitor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateVisitorPassRequest(
        @NotBlank @Size(max = 100) String visitorName,
        @NotBlank @Size(max = 20) String visitorPhone,
        @NotBlank @Size(max = 250) String purpose,
        @NotNull LocalDate visitDate
) {
}
