package com.leavemanagement.controller;

import com.leavemanagement.dto.LeaveRequestDTO;
import com.leavemanagement.dto.LeaveResponseDTO;
import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import com.leavemanagement.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    /** Apply for leave. */
    @PostMapping
    public ResponseEntity<LeaveResponseDTO> createLeaveRequest(
            @Valid @RequestBody LeaveRequestDTO dto,
            @AuthenticationPrincipal User user) {
        LeaveRequest leaveRequest = leaveService.createLeaveRequest(dto, user.getId());
        return ResponseEntity.ok(leaveService.getLeaveRequestById(leaveRequest.getId()));
    }

    /** Get the authenticated employee's own leave history. */
    @GetMapping
    public ResponseEntity<List<LeaveResponseDTO>> getMyLeaveRequests(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leaveService.getLeaveRequestsByEmployee(user.getId()));
    }

    /** Get a single leave request by ID. Employees can only see their own. */
    @GetMapping("/{id}")
    public ResponseEntity<LeaveResponseDTO> getLeaveRequestById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        LeaveResponseDTO dto = leaveService.getLeaveRequestById(id);

        // Employees may only view their own requests.
        if (user.getRole() == User.Role.EMPLOYEE &&
                !dto.getEmployeeId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You may only view your own leave requests");
        }

        return ResponseEntity.ok(dto);
    }

    /** Cancel a pending leave request. Only the owner can cancel. */
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelLeaveRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        leaveService.cancelLeaveRequest(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
