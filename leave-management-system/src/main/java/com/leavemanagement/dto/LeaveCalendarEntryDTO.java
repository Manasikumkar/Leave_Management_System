package com.leavemanagement.dto;

import com.leavemanagement.entity.LeaveRequest;

import java.time.LocalDate;

public class LeaveCalendarEntryDTO {
    private Long employeeId;
    private String employeeName;
    private LeaveRequest.LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;

    public LeaveCalendarEntryDTO() {
    }

    public LeaveCalendarEntryDTO(Long employeeId, String employeeName, LeaveRequest.LeaveType leaveType,
                                  LocalDate startDate, LocalDate endDate) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public LeaveRequest.LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveRequest.LeaveType leaveType) { this.leaveType = leaveType; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
