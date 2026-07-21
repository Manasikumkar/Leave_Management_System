package com.leavemanagement.dto;

import java.util.Map;

public class LeaveReportDTO {
    private long totalRequests;
    private long approvedRequests;
    private long rejectedRequests;
    private long pendingRequests;
    private long cancelledRequests;
    private Map<String, Long> requestsByLeaveType;
    private Map<String, Long> requestsByDepartment;
    private double averageApprovalTimeHours;

    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }
    public long getApprovedRequests() { return approvedRequests; }
    public void setApprovedRequests(long approvedRequests) { this.approvedRequests = approvedRequests; }
    public long getRejectedRequests() { return rejectedRequests; }
    public void setRejectedRequests(long rejectedRequests) { this.rejectedRequests = rejectedRequests; }
    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }
    public long getCancelledRequests() { return cancelledRequests; }
    public void setCancelledRequests(long cancelledRequests) { this.cancelledRequests = cancelledRequests; }
    public Map<String, Long> getRequestsByLeaveType() { return requestsByLeaveType; }
    public void setRequestsByLeaveType(Map<String, Long> requestsByLeaveType) { this.requestsByLeaveType = requestsByLeaveType; }
    public Map<String, Long> getRequestsByDepartment() { return requestsByDepartment; }
    public void setRequestsByDepartment(Map<String, Long> requestsByDepartment) { this.requestsByDepartment = requestsByDepartment; }
    public double getAverageApprovalTimeHours() { return averageApprovalTimeHours; }
    public void setAverageApprovalTimeHours(double averageApprovalTimeHours) { this.averageApprovalTimeHours = averageApprovalTimeHours; }
}
