package com.leavemanagement.controller;

import com.leavemanagement.dto.LeaveResponseDTO;
import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import com.leavemanagement.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/manager")
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {
    
    private final LeaveService leaveService;
    
    public ManagerController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }
    
    @GetMapping("/leaves/pending")
    public ResponseEntity<List<LeaveResponseDTO>> getPendingLeaves() {
        List<LeaveResponseDTO> pendingLeaves = leaveService.getPendingLeaveRequests();
        return ResponseEntity.ok(pendingLeaves);
    }
    
    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveResponseDTO>> getAllLeaves() {
        List<LeaveResponseDTO> allLeaves = leaveService.getAllLeaveRequests();
        return ResponseEntity.ok(allLeaves);
    }
    
    @GetMapping("/leaves/{id}")
    public ResponseEntity<LeaveResponseDTO> getLeaveRequest(@PathVariable Long id) {
        LeaveResponseDTO leaveRequest = leaveService.getLeaveRequestById(id);
        return ResponseEntity.ok(leaveRequest);
    }
    
    @PutMapping("/leaves/{id}/approve")
    public ResponseEntity<LeaveResponseDTO> approveLeaveRequest(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> request,
            @AuthenticationPrincipal User manager) {
        
        String comments = null;
        if (request != null && request.containsKey("comments")) {
            comments = request.get("comments");
        }
        
        LeaveRequest leaveRequest = leaveService.updateLeaveStatus(
                id, LeaveRequest.Status.APPROVED, comments, manager.getId());
        
        return ResponseEntity.ok(convertToDTO(leaveRequest));
    }
    
    @PutMapping("/leaves/{id}/reject")
    public ResponseEntity<LeaveResponseDTO> rejectLeaveRequest(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> request,
            @AuthenticationPrincipal User manager) {
        
        String comments = null;
        if (request != null && request.containsKey("comments")) {
            comments = request.get("comments");
        }
        
        LeaveRequest leaveRequest = leaveService.updateLeaveStatus(
                id, LeaveRequest.Status.REJECTED, comments, manager.getId());
        
        return ResponseEntity.ok(convertToDTO(leaveRequest));
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
        
        if (leaveRequest.getManager() != null) {
            dto.setManagerId(leaveRequest.getManager().getId());
            dto.setManagerName(leaveRequest.getManager().getFirstName() + " " + 
                              leaveRequest.getManager().getLastName());
        }
        
        if (leaveRequest.getEmployee() != null) {
            dto.setEmployeeId(leaveRequest.getEmployee().getId());
            dto.setEmployeeName(leaveRequest.getEmployee().getFirstName() + " " + 
                               leaveRequest.getEmployee().getLastName());
        }
        
        return dto;
    }
}