package com.leavemanagement.dto;

import com.leavemanagement.entity.LeaveAdvance;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class LeaveAdvanceDTO {
    private Long id;

    @NotNull(message = "Advance days requested is required")
    @Min(value = 1, message = "Must request at least 1 day")
    private Integer advanceDaysRequested;

    private String reason;
    private LeaveAdvance.Status status;
    private Long employeeId;
    private String employeeName;
    private String reviewComments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getAdvanceDaysRequested() { return advanceDaysRequested; }
    public void setAdvanceDaysRequested(Integer advanceDaysRequested) { this.advanceDaysRequested = advanceDaysRequested; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public LeaveAdvance.Status getStatus() { return status; }
    public void setStatus(LeaveAdvance.Status status) { this.status = status; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public String getReviewComments() { return reviewComments; }
    public void setReviewComments(String reviewComments) { this.reviewComments = reviewComments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
