package com.leavemanagement.dto;

public class LeaveBalanceDTO {
    private Integer totalLeaveDays;
    private Integer usedLeaveDays;
    private Integer remainingLeaveDays;
    
    public LeaveBalanceDTO() {
    }
    
    public LeaveBalanceDTO(Integer totalLeaveDays, Integer usedLeaveDays, Integer remainingLeaveDays) {
        this.totalLeaveDays = totalLeaveDays;
        this.usedLeaveDays = usedLeaveDays;
        this.remainingLeaveDays = remainingLeaveDays;
    }
    
    public Integer getTotalLeaveDays() {
        return totalLeaveDays;
    }
    
    public void setTotalLeaveDays(Integer totalLeaveDays) {
        this.totalLeaveDays = totalLeaveDays;
    }
    
    public Integer getUsedLeaveDays() {
        return usedLeaveDays;
    }
    
    public void setUsedLeaveDays(Integer usedLeaveDays) {
        this.usedLeaveDays = usedLeaveDays;
    }
    
    public Integer getRemainingLeaveDays() {
        return remainingLeaveDays;
    }
    
    public void setRemainingLeaveDays(Integer remainingLeaveDays) {
        this.remainingLeaveDays = remainingLeaveDays;
    }
}