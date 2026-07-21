package com.leavemanagement.dto;

import com.leavemanagement.entity.LeaveRequest;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class LeavePolicyDTO {
    private Long id;

    @NotNull(message = "Leave type is required")
    private LeaveRequest.LeaveType leaveType;

    @NotNull(message = "Default annual days is required")
    @Min(value = 0, message = "Default annual days cannot be negative")
    private Integer defaultAnnualDays;

    @NotNull(message = "Max consecutive days is required")
    @Min(value = 1, message = "Max consecutive days must be at least 1")
    private Integer maxConsecutiveDays;

    private boolean carryForwardAllowed;

    @Min(value = 0, message = "Max carry forward days cannot be negative")
    private Integer maxCarryForwardDays;

    private boolean requiresApproval = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LeaveRequest.LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveRequest.LeaveType leaveType) { this.leaveType = leaveType; }
    public Integer getDefaultAnnualDays() { return defaultAnnualDays; }
    public void setDefaultAnnualDays(Integer defaultAnnualDays) { this.defaultAnnualDays = defaultAnnualDays; }
    public Integer getMaxConsecutiveDays() { return maxConsecutiveDays; }
    public void setMaxConsecutiveDays(Integer maxConsecutiveDays) { this.maxConsecutiveDays = maxConsecutiveDays; }
    public boolean isCarryForwardAllowed() { return carryForwardAllowed; }
    public void setCarryForwardAllowed(boolean carryForwardAllowed) { this.carryForwardAllowed = carryForwardAllowed; }
    public Integer getMaxCarryForwardDays() { return maxCarryForwardDays; }
    public void setMaxCarryForwardDays(Integer maxCarryForwardDays) { this.maxCarryForwardDays = maxCarryForwardDays; }
    public boolean isRequiresApproval() { return requiresApproval; }
    public void setRequiresApproval(boolean requiresApproval) { this.requiresApproval = requiresApproval; }
}
