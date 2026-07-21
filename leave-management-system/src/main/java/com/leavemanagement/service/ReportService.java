package com.leavemanagement.service;

import com.leavemanagement.dto.LeaveReportDTO;
import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.repository.LeaveRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final LeaveRepository leaveRepository;

    public ReportService(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    /**
     * Generates a summary report for leave requests created within the given date range.
     *
     * @param from start of the range (inclusive)
     * @param to   end of the range (inclusive – ceiling set to end-of-day internally)
     */
    public LeaveReportDTO generateReport(LocalDateTime from, LocalDateTime to) {
        LocalDateTime ceiling = to.toLocalDate().atTime(23, 59, 59);
        List<LeaveRequest> requests = leaveRepository.findByCreatedAtBetween(from, ceiling);

        LeaveReportDTO report = new LeaveReportDTO();

        report.setTotalRequests(requests.size());

        report.setApprovedRequests(requests.stream()
                .filter(r -> r.getStatus() == LeaveRequest.Status.APPROVED).count());
        report.setRejectedRequests(requests.stream()
                .filter(r -> r.getStatus() == LeaveRequest.Status.REJECTED).count());
        report.setPendingRequests(requests.stream()
                .filter(r -> r.getStatus() == LeaveRequest.Status.PENDING).count());
        report.setCancelledRequests(requests.stream()
                .filter(r -> r.getStatus() == LeaveRequest.Status.CANCELLED).count());

        // Breakdown by leave type
        Map<String, Long> byType = requests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getLeaveType().name(),
                        Collectors.counting()));
        report.setRequestsByLeaveType(byType);

        // Breakdown by department (null-safe: employees without a department go into "UNASSIGNED")
        Map<String, Long> byDept = requests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getEmployee().getDepartment() != null
                                ? r.getEmployee().getDepartment()
                                : "UNASSIGNED",
                        Collectors.counting()));
        report.setRequestsByDepartment(byDept);

        // Average time from submission to approval/rejection (hours)
        double avgApprovalTime = requests.stream()
                .filter(r -> r.getUpdatedAt() != null &&
                        (r.getStatus() == LeaveRequest.Status.APPROVED ||
                         r.getStatus() == LeaveRequest.Status.REJECTED))
                .mapToLong(r -> java.time.Duration.between(r.getCreatedAt(), r.getUpdatedAt()).toHours())
                .average()
                .orElse(0.0);
        report.setAverageApprovalTimeHours(avgApprovalTime);

        return report;
    }
}
