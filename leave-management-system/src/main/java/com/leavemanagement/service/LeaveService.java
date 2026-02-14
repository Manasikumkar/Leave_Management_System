package com.leavemanagement.service;

import com.leavemanagement.dto.LeaveBalanceDTO;
import com.leavemanagement.dto.LeaveRequestDTO;
import com.leavemanagement.dto.LeaveResponseDTO;
import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import com.leavemanagement.repository.LeaveRepository;
import com.leavemanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {
    
    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    
    public LeaveService(LeaveRepository leaveRepository, 
                       UserRepository userRepository, 
                       UserService userService) {
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }
    
    @Transactional
    public LeaveRequest createLeaveRequest(LeaveRequestDTO dto, Long employeeId) {
        User employee = userService.getUserById(employeeId);
        
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
        
        long weekdays = calculateWeekdays(dto.getStartDate(), dto.getEndDate());
        int requestedDays = (int) weekdays;
        
        if (requestedDays <= 0) {
            throw new IllegalArgumentException("Leave duration must be at least 1 day");
        }
        
        if (employee.getRemainingLeaveDays() < requestedDays) {
            throw new IllegalArgumentException("Insufficient leave balance. Available: " + 
                                             employee.getRemainingLeaveDays() + " days");
        }
        
        List<LeaveRequest> existingLeaves = leaveRepository.findByEmployeeAndStartDateBetween(
                employee, dto.getStartDate(), dto.getEndDate());
        
        if (!existingLeaves.isEmpty()) {
            throw new IllegalArgumentException("You already have a leave request for these dates");
        }
        
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setLeaveType(dto.getLeaveType());
        leaveRequest.setStartDate(dto.getStartDate());
        leaveRequest.setEndDate(dto.getEndDate());
        leaveRequest.setNumberOfDays(requestedDays);
        leaveRequest.setReason(dto.getReason());
        leaveRequest.setStatus(LeaveRequest.Status.PENDING);
        leaveRequest.setCreatedAt(LocalDateTime.now());
        
        return leaveRepository.save(leaveRequest);
    }
    
    @Transactional
    public LeaveRequest updateLeaveStatus(Long leaveId, LeaveRequest.Status status, 
                                         String comments, Long managerId) {
        LeaveRequest leaveRequest = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + leaveId));
        
        User manager = userService.getUserById(managerId);
        
        if (leaveRequest.getStatus() != LeaveRequest.Status.PENDING) {
            throw new IllegalArgumentException("Leave request is not in pending status. Current status: " + 
                                             leaveRequest.getStatus());
        }
        
        leaveRequest.setStatus(status);
        leaveRequest.setManager(manager);
        leaveRequest.setManagerComments(comments);
        leaveRequest.setUpdatedAt(LocalDateTime.now());
        
        if (status == LeaveRequest.Status.APPROVED) {
            userService.updateUsedLeaveDays(
                    leaveRequest.getEmployee().getId(), 
                    leaveRequest.getNumberOfDays());
        }
        
        return leaveRepository.save(leaveRequest);
    }
    
    public List<LeaveResponseDTO> getLeaveRequestsByEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<LeaveResponseDTO> getPendingLeaveRequests() {
        return leaveRepository.findByStatusOrderByCreatedAtDesc(LeaveRequest.Status.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<LeaveResponseDTO> getAllLeaveRequests() {
        return leaveRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public LeaveResponseDTO getLeaveRequestById(Long id) {
        LeaveRequest leaveRequest = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));
        return convertToDTO(leaveRequest);
    }
    
    public LeaveRequest getLeaveRequestEntityById(Long id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));
    }
    
    public LeaveBalanceDTO getLeaveBalance(Long employeeId) {
        User employee = userService.getUserById(employeeId);
        Integer usedDays = leaveRepository.countUsedLeaveDays(employeeId);
        if (usedDays == null) usedDays = 0;
        
        return new LeaveBalanceDTO(
            employee.getTotalLeaveDays(),
            usedDays,
            employee.getTotalLeaveDays() - usedDays
        );
    }
    
    @Transactional
    public void cancelLeaveRequest(Long leaveId, Long employeeId) {
        LeaveRequest leaveRequest = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + leaveId));
        
        if (!leaveRequest.getEmployee().getId().equals(employeeId)) {
            throw new IllegalArgumentException("You can only cancel your own leave requests");
        }
        
        if (leaveRequest.getStatus() != LeaveRequest.Status.PENDING) {
            throw new IllegalArgumentException("Only pending leave requests can be cancelled");
        }
        
        leaveRequest.setStatus(LeaveRequest.Status.CANCELLED);
        leaveRequest.setUpdatedAt(LocalDateTime.now());
        leaveRepository.save(leaveRequest);
    }
    
    public List<LeaveResponseDTO> getLeaveRequestsByStatus(LeaveRequest.Status status) {
        return leaveRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public boolean hasOverlappingLeave(Long employeeId, LocalDate startDate, LocalDate endDate) {
        User employee = userService.getUserById(employeeId);
        List<LeaveRequest> existingLeaves = leaveRepository.findByEmployeeAndStartDateBetween(
                employee, startDate, endDate);
        return !existingLeaves.isEmpty();
    }
    
    private LeaveResponseDTO convertToDTO(LeaveRequest leaveRequest) {
        LeaveResponseDTO dto = new LeaveResponseDTO();
        
        // Basic information
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
        
        // Employee information
        if (leaveRequest.getEmployee() != null) {
            dto.setEmployeeId(leaveRequest.getEmployee().getId());
            dto.setEmployeeName(leaveRequest.getEmployee().getFirstName() + " " + 
                               leaveRequest.getEmployee().getLastName());
        }
        
        // Manager information
        if (leaveRequest.getManager() != null) {
            dto.setManagerId(leaveRequest.getManager().getId());
            dto.setManagerName(leaveRequest.getManager().getFirstName() + " " + 
                              leaveRequest.getManager().getLastName());
        }
        
        return dto;
    }
    
    private long calculateWeekdays(LocalDate startDate, LocalDate endDate) {
        long weekdays = 0;
        LocalDate date = startDate;
        
        while (!date.isAfter(endDate)) {
            if (date.getDayOfWeek().getValue() < 6) {
                weekdays++;
            }
            date = date.plusDays(1);
        }
        
        return weekdays;
    }
}