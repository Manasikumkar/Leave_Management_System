package com.leavemanagement.controller;

import com.leavemanagement.dto.AuthRequest;
import com.leavemanagement.dto.AuthResponse;
import com.leavemanagement.dto.UserDTO;
import com.leavemanagement.entity.User;
import com.leavemanagement.service.JwtService;
import com.leavemanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                         JwtService jwtService,
                         UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = (User) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(user);

        return ResponseEntity.ok(AuthResponse.create(jwtToken, user));
    }

    /**
     * Self-registration endpoint. Always creates an EMPLOYEE account.
     * To create MANAGER or HR_ADMIN users use POST /hr/users (HR Admin only).
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserDTO userDTO) {
        User user = userService.registerUser(userDTO);
        String jwtToken = jwtService.generateToken(user);

        return ResponseEntity.ok(AuthResponse.create(jwtToken, user));
    }

    @GetMapping("/validate")
    public ResponseEntity<AuthResponse.UserDTO> validateToken(
            @RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token format");
        }

        String jwt = token.substring(7);
        String email = jwtService.extractUsername(jwt);
        User user = userService.getUserByEmail(email);

        return ResponseEntity.ok(AuthResponse.UserDTO.fromUser(user));
    }
}
