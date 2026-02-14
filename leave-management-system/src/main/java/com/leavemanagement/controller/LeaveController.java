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
    
    @PostMapping
    public ResponseEntity<LeaveResponseDTO> createLeaveRequest(
            @Valid @RequestBody LeaveRequestDTO leaveRequestDTO,
            @AuthenticationPrincipal User user) {
        
        LeaveRequest leaveRequest = leaveService.createLeaveRequest(leaveRequestDTO, user.getId());
        return ResponseEntity.ok(convertToDTO(leaveRequest));
    }
    
    @GetMapping
    public ResponseEntity<List<LeaveResponseDTO>> getMyLeaveRequests(
            @AuthenticationPrincipal User user) {
        
        List<LeaveResponseDTO> leaves = leaveService.getLeaveRequestsByEmployee(user.getId());
        return ResponseEntity.ok(leaves);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LeaveResponseDTO> getLeaveRequestById(@PathVariable Long id) {
        LeaveResponseDTO leave = leaveService.getLeaveRequestById(id);
        return ResponseEntity.ok(leave);
    }
    
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelLeaveRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        
        leaveService.cancelLeaveRequest(id, user.getId());
        return ResponseEntity.noContent().build();
    }
    
    private LeaveResponseDTO convertToDTO(LeaveRequest leaveRequest) {
        LeaveResponseDTO dto = new LeaveResponseDTO();
        dto.setId(leaveRequest.getId());
        dto.setLeaveType(leaveRequest.getLeaveType());
        dto.setStartDate(leaveRequest.getStartDate());
        dto.setEndDate(leaveRequest.getEndDate());
        dto.setReason(leaveRequest.getReason());
        dto.setStatus(leaveRequest.getStatus());
        dto.setNumberOfDays(leaveRequest.getNumberOfDays());
        dto.setCreatedAt(leaveRequest.getCreatedAt());
        dto.setUpdatedAt(leaveRequest.getUpdatedAt());
        
        // ✅ CRITICAL: Set manager comments
        dto.setManagerComments(leaveRequest.getManagerComments());
        
        // ✅ Set manager information
        if (leaveRequest.getManager() != null) {
            dto.setManagerId(leaveRequest.getManager().getId());
            dto.setManagerName(leaveRequest.getManager().getFirstName() + " " + 
                              leaveRequest.getManager().getLastName());
        }
        
        // ✅ Set employee information
        if (leaveRequest.getEmployee() != null) {
            dto.setEmployeeId(leaveRequest.getEmployee().getId());
            dto.setEmployeeName(leaveRequest.getEmployee().getFirstName() + " " + 
                               leaveRequest.getEmployee().getLastName());
        }
        
        return dto;
    }
}