package com.leavemanagement.controller;

import com.leavemanagement.dto.LeaveBalanceDTO;
import com.leavemanagement.dto.UserDTO;
import com.leavemanagement.entity.User;
import com.leavemanagement.service.LeaveService;
import com.leavemanagement.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users") // REMOVED /api prefix
public class UserController {
    
    private final UserService userService;
    private final LeaveService leaveService;
    
    public UserController(UserService userService, LeaveService leaveService) {
        this.userService = userService;
        this.leaveService = leaveService;
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserDTO.fromUser(user));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserDTO.fromUser(user));
    }
    
    @GetMapping("/me/leave-balance")
    public ResponseEntity<LeaveBalanceDTO> getMyLeaveBalance(@AuthenticationPrincipal User user) {
        LeaveBalanceDTO balance = leaveService.getLeaveBalance(user.getId());
        return ResponseEntity.ok(balance);
    }
    
    @GetMapping("/{id}/leave-balance")
    public ResponseEntity<LeaveBalanceDTO> getUserLeaveBalance(@PathVariable Long id) {
        LeaveBalanceDTO balance = leaveService.getLeaveBalance(id);
        return ResponseEntity.ok(balance);
    }
}