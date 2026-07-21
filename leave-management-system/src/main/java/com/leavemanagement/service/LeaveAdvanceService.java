package com.leavemanagement.service;

import com.leavemanagement.dto.LeaveAdvanceDTO;
import com.leavemanagement.entity.LeaveAdvance;
import com.leavemanagement.entity.User;
import com.leavemanagement.repository.LeaveAdvanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveAdvanceService {

    private final LeaveAdvanceRepository leaveAdvanceRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public LeaveAdvanceService(LeaveAdvanceRepository leaveAdvanceRepository,
                               UserService userService,
                               NotificationService notificationService) {
        this.leaveAdvanceRepository = leaveAdvanceRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @Transactional
    public LeaveAdvanceDTO requestAdvance(LeaveAdvanceDTO dto, Long employeeId) {
        User employee = userService.getUserById(employeeId);

        if (dto.getAdvanceDaysRequested() == null || dto.getAdvanceDaysRequested() < 1) {
            throw new IllegalArgumentException("Must request at least 1 advance day");
        }

        LeaveAdvance advance = new LeaveAdvance();
        advance.setEmployee(employee);
        advance.setAdvanceDaysRequested(dto.getAdvanceDaysRequested());
        advance.setReason(dto.getReason());
        advance.setStatus(LeaveAdvance.Status.PENDING);
        advance.setCreatedAt(LocalDateTime.now());

        LeaveAdvance saved = leaveAdvanceRepository.save(advance);

        notificationService.notifyGeneric(
                employee.getEmail(),
                "Leave Advance Request Submitted",
                String.format("Hi %s, your request for %d advance leave day(s) has been submitted.",
                        employee.getFirstName(), dto.getAdvanceDaysRequested()));

        return toDTO(saved);
    }

    @Transactional
    public LeaveAdvanceDTO reviewAdvance(Long advanceId, LeaveAdvance.Status status,
                                        String comments, Long hrAdminId) {
        LeaveAdvance advance = getEntityById(advanceId);

        if (advance.getStatus() != LeaveAdvance.Status.PENDING) {
            throw new IllegalArgumentException("Advance request is already " + advance.getStatus());
        }
        if (status == LeaveAdvance.Status.PENDING) {
            throw new IllegalArgumentException("Target status must be APPROVED or REJECTED");
        }

        User hrAdmin = userService.getUserById(hrAdminId);
        advance.setStatus(status);
        advance.setApprovedBy(hrAdmin);
        advance.setReviewComments(comments);
        advance.setUpdatedAt(LocalDateTime.now());

        if (status == LeaveAdvance.Status.APPROVED) {
            // Credit the advance days directly to the employee's total leave allowance.
            User employee = advance.getEmployee();
            employee.setTotalLeaveDays(employee.getTotalLeaveDays() + advance.getAdvanceDaysRequested());
            userService.updateUsedLeaveDays(employee.getId(), 0); // triggers save
        }

        LeaveAdvance saved = leaveAdvanceRepository.save(advance);

        notificationService.notifyGeneric(
                advance.getEmployee().getEmail(),
                "Leave Advance Request " + status,
                String.format("Your leave advance request for %d day(s) has been %s.%s",
                        advance.getAdvanceDaysRequested(), status,
                        comments != null ? "\nComments: " + comments : ""));

        return toDTO(saved);
    }

    public List<LeaveAdvanceDTO> getMyAdvances(Long employeeId) {
        return leaveAdvanceRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<LeaveAdvanceDTO> getPendingAdvances() {
        return leaveAdvanceRepository.findByStatusOrderByCreatedAtDesc(LeaveAdvance.Status.PENDING)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<LeaveAdvanceDTO> getAllAdvances() {
        return leaveAdvanceRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private LeaveAdvance getEntityById(Long id) {
        return leaveAdvanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave advance not found with id: " + id));
    }

    private LeaveAdvanceDTO toDTO(LeaveAdvance a) {
        LeaveAdvanceDTO dto = new LeaveAdvanceDTO();
        dto.setId(a.getId());
        dto.setAdvanceDaysRequested(a.getAdvanceDaysRequested());
        dto.setReason(a.getReason());
        dto.setStatus(a.getStatus());
        dto.setReviewComments(a.getReviewComments());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        if (a.getEmployee() != null) {
            dto.setEmployeeId(a.getEmployee().getId());
            dto.setEmployeeName(a.getEmployee().getFirstName() + " " + a.getEmployee().getLastName());
        }
        return dto;
    }
}
