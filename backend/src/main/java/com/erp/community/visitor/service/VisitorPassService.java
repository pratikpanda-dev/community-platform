package com.erp.community.visitor.service;

import com.erp.community.employee.entity.Employee;
import com.erp.community.employee.repository.EmployeeRepository;
import com.erp.community.society.entity.Society;
import com.erp.community.society.repository.SocietyRepository;
import com.erp.community.visitor.dto.CreateVisitorPassRequest;
import com.erp.community.visitor.entity.VisitorPass;
import com.erp.community.visitor.repository.VisitorPassRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class VisitorPassService {

    private final VisitorPassRepository visitorPassRepository;
    private final EmployeeRepository employeeRepository;
    private final SocietyRepository societyRepository;

    public VisitorPassService(
            VisitorPassRepository visitorPassRepository,
            EmployeeRepository employeeRepository,
            SocietyRepository societyRepository
    ) {
        this.visitorPassRepository = visitorPassRepository;
        this.employeeRepository = employeeRepository;
        this.societyRepository = societyRepository;
    }

    public VisitorPass create(Long residentId, Long societyId, CreateVisitorPassRequest request) {
        if (request.visitDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("A visitor pass cannot be created for a past date");
        }

        Employee resident = employeeRepository.findById(residentId)
                .orElseThrow(() -> new IllegalArgumentException("Resident not found"));
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new IllegalArgumentException("Society not found"));

        VisitorPass pass = new VisitorPass();
        pass.setResident(resident);
        pass.setSociety(society);
        pass.setVisitorName(request.visitorName().trim());
        pass.setVisitorPhone(request.visitorPhone().trim());
        pass.setPurpose(request.purpose().trim());
        pass.setVisitDate(request.visitDate());
        pass.setPassCode("VP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        pass.setCreatedAt(LocalDateTime.now());

        return visitorPassRepository.save(pass);
    }

    public List<VisitorPass> getMine(Long residentId) {
        return visitorPassRepository.findByResidentIdOrderByVisitDateDescCreatedAtDesc(residentId);
    }

    public List<VisitorPass> getForSociety(Long societyId) {
        return visitorPassRepository.findBySocietyIdOrderByVisitDateDescCreatedAtDesc(societyId);
    }
}
