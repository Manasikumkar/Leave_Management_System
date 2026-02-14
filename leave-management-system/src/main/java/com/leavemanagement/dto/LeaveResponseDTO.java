package com.leavemanagement.dto;

import com.leavemanagement.entity.LeaveRequest;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveResponseDTO {
    private Long id;
    private LeaveRequest.LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveRequest.Status status;
    private String managerComments;  // ✅ This field exists
    private Long employeeId;
    private String employeeName;
    private Long managerId;
    private String managerName;
    private Integer numberOfDays;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public LeaveResponseDTO() {
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LeaveRequest.LeaveType getLeaveType() {
        return leaveType;
    }
    
    public void setLeaveType(LeaveRequest.LeaveType leaveType) {
        this.leaveType = leaveType;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public LeaveRequest.Status getStatus() {
        return status;
    }
    
    public void setStatus(LeaveRequest.Status status) {
        this.status = status;
    }
    
    public String getManagerComments() {
        return managerComments;
    }
    
    public void setManagerComments(String managerComments) {
        this.managerComments = managerComments;
    }
    
    public Long getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
    
    public String getEmployeeName() {
        return employeeName;
    }
    
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    
    public Long getManagerId() {
        return managerId;
    }
    
    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }
    
    public String getManagerName() {
        return managerName;
    }
    
    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }
    
    public Integer getNumberOfDays() {
        return numberOfDays;
    }
    
    public void setNumberOfDays(Integer numberOfDays) {
        this.numberOfDays = numberOfDays;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}