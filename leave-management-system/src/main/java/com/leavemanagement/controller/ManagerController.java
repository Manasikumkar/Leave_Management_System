package com.leavemanagement.controller;

import com.leavemanagement.dto.LeaveCalendarEntryDTO;
import com.leavemanagement.dto.LeaveResponseDTO;
import com.leavemanagement.dto.UserDTO;
import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import com.leavemanagement.service.LeaveService;
import com.leavemanagement.service.UserService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/manager")
@PreAuthorize("hasAnyRole('MANAGER', 'HR_ADMIN')")
public class ManagerController {

    private final LeaveService leaveService;
    private final UserService userService;

    public ManagerController(LeaveService leaveService, UserService userService) {
        this.leaveService = leaveService;
        this.userService = userService;
    }

    // ─── Pending Leaves ───────────────────────────────────────────────────────

    /**
     * Pending leave requests scoped to the manager's own direct reports.
     * HR_ADMIN sees all pending requests.
     */
    @GetMapping("/leaves/pending")
    public ResponseEntity<List<LeaveResponseDTO>> getPendingLeaves(
            @AuthenticationPrincipal User manager) {
        List<LeaveResponseDTO> leaves = manager.getRole() == User.Role.HR_ADMIN
                ? leaveService.getPendingLeaveRequests()
                : leaveService.getPendingLeaveRequestsForManager(manager.getId());
        return ResponseEntity.ok(leaves);
    }

    /** All leave requests scoped to the manager's team (HR_ADMIN sees all). */
    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveResponseDTO>> getAllLeaves(
            @AuthenticationPrincipal User manager) {
        List<LeaveResponseDTO> leaves = manager.getRole() == User.Role.HR_ADMIN
                ? leaveService.getAllLeaveRequests()
                : leaveService.getAllLeaveRequestsForManager(manager.getId());
        return ResponseEntity.ok(leaves);
    }

    @GetMapping("/leaves/{id}")
    public ResponseEntity<LeaveResponseDTO> getLeaveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getLeaveRequestById(id));
    }

    // ─── Approve / Reject ─────────────────────────────────────────────────────

    @PutMapping("/leaves/{id}/approve")
    public ResponseEntity<LeaveResponseDTO> approveLeaveRequest(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal User manager) {

        String comments = body != null ? body.get("comments") : null;
        leaveService.updateLeaveStatus(id, LeaveRequest.Status.APPROVED, comments, manager.getId());
        return ResponseEntity.ok(leaveService.getLeaveRequestById(id));
    }

    @PutMapping("/leaves/{id}/reject")
    public ResponseEntity<LeaveResponseDTO> rejectLeaveRequest(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal User manager) {

        String comments = body != null ? body.get("comments") : null;
        leaveService.updateLeaveStatus(id, LeaveRequest.Status.REJECTED, comments, manager.getId());
        return ResponseEntity.ok(leaveService.getLeaveRequestById(id));
    }

    // ─── Team Calendar ────────────────────────────────────────────────────────

    /**
     * Returns approved leave for all direct reports in a date range.
     * Defaults to the current month if no dates provided.
     */
    @GetMapping("/team-calendar")
    public ResponseEntity<List<LeaveCalendarEntryDTO>> getTeamCalendar(
            @AuthenticationPrincipal User manager,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        LocalDate from = start != null ? start : LocalDate.now().withDayOfMonth(1);
        LocalDate to   = end   != null ? end   : from.plusMonths(1).minusDays(1);

        return ResponseEntity.ok(leaveService.getTeamCalendar(manager.getId(), from, to));
    }

    // ─── Team Members ─────────────────────────────────────────────────────────

    /** Direct reports of the authenticated manager. */
    @GetMapping("/team")
    public ResponseEntity<List<UserDTO>> getMyTeam(@AuthenticationPrincipal User manager) {
        List<User> team = userService.getDirectReports(manager.getId());
        return ResponseEntity.ok(userService.toDtoList(team));
    }
}
