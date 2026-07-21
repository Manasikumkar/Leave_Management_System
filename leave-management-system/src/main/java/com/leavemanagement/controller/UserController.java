package com.leavemanagement.controller;

import com.leavemanagement.dto.LeaveAdvanceDTO;
import com.leavemanagement.dto.LeaveBalanceDTO;
import com.leavemanagement.dto.LeaveDonationDTO;
import com.leavemanagement.dto.UserDTO;
import com.leavemanagement.entity.User;
import com.leavemanagement.service.LeaveAdvanceService;
import com.leavemanagement.service.LeaveDonationService;
import com.leavemanagement.service.LeaveService;
import com.leavemanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final LeaveService leaveService;
    private final LeaveAdvanceService leaveAdvanceService;
    private final LeaveDonationService leaveDonationService;

    public UserController(UserService userService,
                          LeaveService leaveService,
                          LeaveAdvanceService leaveAdvanceService,
                          LeaveDonationService leaveDonationService) {
        this.userService = userService;
        this.leaveService = leaveService;
        this.leaveAdvanceService = leaveAdvanceService;
        this.leaveDonationService = leaveDonationService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserDTO.fromUser(userService.getUserById(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(UserDTO.fromUser(userService.getUserById(id)));
    }

    @GetMapping("/me/leave-balance")
    public ResponseEntity<LeaveBalanceDTO> getMyLeaveBalance(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leaveService.getLeaveBalance(user.getId()));
    }

    @GetMapping("/{id}/leave-balance")
    public ResponseEntity<LeaveBalanceDTO> getUserLeaveBalance(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getLeaveBalance(id));
    }

    /**
     * All authenticated users can get the employee list
     * so employees can pick a recipient for leave donation
     * without needing HR Admin role.
     */
    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllEmployees(@AuthenticationPrincipal User currentUser) {
        List<User> users = userService.getAllUsers()
                .stream()
                // Exclude current user — cannot donate to yourself
                .filter(u -> !u.getId().equals(currentUser.getId()))
                // Only show active accounts
                .filter(User::isEnabled)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userService.toDtoList(users));
    }

    // ── Leave Advance ─────────────────────────────────────────────
    @PostMapping("/me/leave-advances")
    public ResponseEntity<LeaveAdvanceDTO> requestAdvance(
            @Valid @RequestBody LeaveAdvanceDTO dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leaveAdvanceService.requestAdvance(dto, user.getId()));
    }

    @GetMapping("/me/leave-advances")
    public ResponseEntity<List<LeaveAdvanceDTO>> getMyAdvances(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leaveAdvanceService.getMyAdvances(user.getId()));
    }

    // ── Leave Donation ────────────────────────────────────────────
    @PostMapping("/me/leave-donations")
    public ResponseEntity<LeaveDonationDTO> donateLeave(
            @Valid @RequestBody LeaveDonationDTO dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leaveDonationService.donateleave(dto, user.getId()));
    }

    @GetMapping("/me/leave-donations/sent")
    public ResponseEntity<List<LeaveDonationDTO>> getMyDonations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leaveDonationService.getMyDonations(user.getId()));
    }

    @GetMapping("/me/leave-donations/received")
    public ResponseEntity<List<LeaveDonationDTO>> getReceivedDonations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leaveDonationService.getReceivedDonations(user.getId()));
    }
}