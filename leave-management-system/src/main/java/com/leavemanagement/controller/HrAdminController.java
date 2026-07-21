package com.leavemanagement.controller;

import com.leavemanagement.dto.*;
import com.leavemanagement.entity.LeaveAdvance;
import com.leavemanagement.entity.LeaveDonation;
import com.leavemanagement.entity.User;
import com.leavemanagement.service.*;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * HR Admin endpoints — all require ROLE_HR_ADMIN.
 *
 * Base path: /hr
 */
@RestController
@RequestMapping("/hr")
@PreAuthorize("hasRole('HR_ADMIN')")
public class HrAdminController {

    private final UserService userService;
    private final LeaveService leaveService;
    private final LeavePolicyService leavePolicyService;
    private final LeaveAdvanceService leaveAdvanceService;
    private final LeaveDonationService leaveDonationService;
    private final ReportService reportService;

    public HrAdminController(UserService userService,
                             LeaveService leaveService,
                             LeavePolicyService leavePolicyService,
                             LeaveAdvanceService leaveAdvanceService,
                             LeaveDonationService leaveDonationService,
                             ReportService reportService) {
        this.userService = userService;
        this.leaveService = leaveService;
        this.leavePolicyService = leavePolicyService;
        this.leaveAdvanceService = leaveAdvanceService;
        this.leaveDonationService = leaveDonationService;
        this.reportService = reportService;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Employee / User Management
    // ══════════════════════════════════════════════════════════════════════════

    /** List all users across the organisation. */
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.toDtoList(userService.getAllUsers()));
    }

    /** List users filtered by role. */
    @GetMapping("/users/by-role")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@RequestParam User.Role role) {
        return ResponseEntity.ok(userService.toDtoList(userService.getUsersByRole(role)));
    }

    /**
     * Create a user with any role (EMPLOYEE / MANAGER / HR_ADMIN),
     * a specified manager, department and leave allowance.
     */
    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        User created = userService.createUserAsHr(userDTO);
        return ResponseEntity.ok(UserDTO.fromUser(created));
    }

    /** Update an existing user's profile, role, manager or leave allowance. */
    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id,
                                              @RequestBody UserDTO userDTO) {
        User updated = userService.updateUserAsHr(id, userDTO);
        return ResponseEntity.ok(UserDTO.fromUser(updated));
    }

    /** Enable or disable a user account. */
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<Void> setUserStatus(@PathVariable Long id,
                                              @RequestBody Map<String, Boolean> body) {
        Boolean enabled = body.get("enabled");
        if (enabled == null) {
            throw new IllegalArgumentException("Request body must contain 'enabled' field");
        }
        userService.setUserEnabled(id, enabled);
        return ResponseEntity.noContent().build();
    }

    /** Adjust a user's total leave allowance directly. */
    @PatchMapping("/users/{id}/leave-allowance")
    public ResponseEntity<UserDTO> setLeaveAllowance(@PathVariable Long id,
                                                     @RequestBody Map<String, Integer> body) {
        Integer days = body.get("totalLeaveDays");
        if (days == null || days < 0) {
            throw new IllegalArgumentException("totalLeaveDays must be a non-negative integer");
        }
        UserDTO dto = new UserDTO();
        dto.setTotalLeaveDays(days);
        User updated = userService.updateUserAsHr(id, dto);
        return ResponseEntity.ok(UserDTO.fromUser(updated));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Leave Policy Configuration
    // ══════════════════════════════════════════════════════════════════════════

    @GetMapping("/policies")
    public ResponseEntity<List<LeavePolicyDTO>> getAllPolicies() {
        return ResponseEntity.ok(leavePolicyService.getAllPolicies());
    }

    @PostMapping("/policies")
    public ResponseEntity<LeavePolicyDTO> createOrUpdatePolicy(
            @Valid @RequestBody LeavePolicyDTO dto) {
        return ResponseEntity.ok(leavePolicyService.createOrUpdatePolicy(dto));
    }

    @DeleteMapping("/policies/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        leavePolicyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Leave Advance Management
    // ══════════════════════════════════════════════════════════════════════════

    @GetMapping("/leave-advances/pending")
    public ResponseEntity<List<LeaveAdvanceDTO>> getPendingAdvances() {
        return ResponseEntity.ok(leaveAdvanceService.getPendingAdvances());
    }

    @GetMapping("/leave-advances")
    public ResponseEntity<List<LeaveAdvanceDTO>> getAllAdvances() {
        return ResponseEntity.ok(leaveAdvanceService.getAllAdvances());
    }

    @PutMapping("/leave-advances/{id}/approve")
    public ResponseEntity<LeaveAdvanceDTO> approveAdvance(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal User hrAdmin) {
        String comments = body != null ? body.get("comments") : null;
        return ResponseEntity.ok(
                leaveAdvanceService.reviewAdvance(id, LeaveAdvance.Status.APPROVED, comments, hrAdmin.getId()));
    }

    @PutMapping("/leave-advances/{id}/reject")
    public ResponseEntity<LeaveAdvanceDTO> rejectAdvance(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal User hrAdmin) {
        String comments = body != null ? body.get("comments") : null;
        return ResponseEntity.ok(
                leaveAdvanceService.reviewAdvance(id, LeaveAdvance.Status.REJECTED, comments, hrAdmin.getId()));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Leave Donation Management
    // ══════════════════════════════════════════════════════════════════════════

    @GetMapping("/leave-donations/pending")
    public ResponseEntity<List<LeaveDonationDTO>> getPendingDonations() {
        return ResponseEntity.ok(leaveDonationService.getPendingDonations());
    }

    @GetMapping("/leave-donations")
    public ResponseEntity<List<LeaveDonationDTO>> getAllDonations() {
        return ResponseEntity.ok(leaveDonationService.getAllDonations());
    }

    @PutMapping("/leave-donations/{id}/approve")
    public ResponseEntity<LeaveDonationDTO> approveDonation(
            @PathVariable Long id,
            @AuthenticationPrincipal User hrAdmin) {
        return ResponseEntity.ok(
                leaveDonationService.reviewDonation(id, LeaveDonation.Status.APPROVED, hrAdmin.getId()));
    }

    @PutMapping("/leave-donations/{id}/reject")
    public ResponseEntity<LeaveDonationDTO> rejectDonation(
            @PathVariable Long id,
            @AuthenticationPrincipal User hrAdmin) {
        return ResponseEntity.ok(
                leaveDonationService.reviewDonation(id, LeaveDonation.Status.REJECTED, hrAdmin.getId()));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Reports
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Company-wide leave report for a date range.
     * Defaults to the current month if no dates are provided.
     *
     * Example: GET /hr/reports?from=2025-01-01&to=2025-01-31
     */
    @GetMapping("/reports")
    public ResponseEntity<LeaveReportDTO> getReport(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        LocalDate start = from != null ? from : LocalDate.now().withDayOfMonth(1);
        LocalDate end   = to   != null ? to   : LocalDate.now();

        LeaveReportDTO report = reportService.generateReport(
                start.atStartOfDay(), end.atTime(23, 59, 59));
        return ResponseEntity.ok(report);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Company-wide Calendar
    // ══════════════════════════════════════════════════════════════════════════

    /** All approved leave for the entire company within a date range. */
    @GetMapping("/calendar")
    public ResponseEntity<List<LeaveCalendarEntryDTO>> getCompanyCalendar(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        LocalDate from = start != null ? start : LocalDate.now().withDayOfMonth(1);
        LocalDate to   = end   != null ? end   : from.plusMonths(1).minusDays(1);

        return ResponseEntity.ok(leaveService.getCompanyCalendar(from, to));
    }
}
