package com.leavemanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_policies")
public class LeavePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private LeaveRequest.LeaveType leaveType;

    @Column(nullable = false)
    private Integer defaultAnnualDays;

    @Column(nullable = false)
    private Integer maxConsecutiveDays;

    @Column(nullable = false)
    private boolean carryForwardAllowed;

    @Column(nullable = false)
    private Integer maxCarryForwardDays;

    @Column(nullable = false)
    private boolean requiresApproval;

    public LeavePolicy() {
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

    public Integer getDefaultAnnualDays() {
        return defaultAnnualDays;
    }

    public void setDefaultAnnualDays(Integer defaultAnnualDays) {
        this.defaultAnnualDays = defaultAnnualDays;
    }

    public Integer getMaxConsecutiveDays() {
        return maxConsecutiveDays;
    }

    public void setMaxConsecutiveDays(Integer maxConsecutiveDays) {
        this.maxConsecutiveDays = maxConsecutiveDays;
    }

    public boolean isCarryForwardAllowed() {
        return carryForwardAllowed;
    }

    public void setCarryForwardAllowed(boolean carryForwardAllowed) {
        this.carryForwardAllowed = carryForwardAllowed;
    }

    public Integer getMaxCarryForwardDays() {
        return maxCarryForwardDays;
    }

    public void setMaxCarryForwardDays(Integer maxCarryForwardDays) {
        this.maxCarryForwardDays = maxCarryForwardDays;
    }

    public boolean isRequiresApproval() {
        return requiresApproval;
    }

    public void setRequiresApproval(boolean requiresApproval) {
        this.requiresApproval = requiresApproval;
    }
}
