package com.leavemanagement.dto;

import com.leavemanagement.entity.LeaveRequest;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class LeaveRequestDTO {
    
    private Long id;
    
    @NotNull(message = "Leave type is required")
    private LeaveRequest.LeaveType leaveType;
    
    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    @FutureOrPresent(message = "End date must be today or in the future")
    private LocalDate endDate;
    
    private String reason;
    
    private Long employeeId;
    private String employeeName;
    private LeaveRequest.Status status;
    private String managerComments;
    private String managerName;
    private Integer numberOfDays;
    
    public LeaveRequestDTO() {
    }
    
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
}