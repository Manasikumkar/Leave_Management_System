package com.leavemanagement.service;

import com.leavemanagement.dto.UserDTO;
import com.leavemanagement.entity.User;
import com.leavemanagement.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    /** Public self-registration. Always creates an EMPLOYEE regardless of what the caller sends. */
    @Transactional
    public User registerUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        // Security: self-registration can never grant MANAGER or HR_ADMIN.
        user.setRole(User.Role.EMPLOYEE);
        user.setHireDate(userDTO.getHireDate() != null ? userDTO.getHireDate() : LocalDate.now());
        user.setTotalLeaveDays(userDTO.getTotalLeaveDays() != null ? userDTO.getTotalLeaveDays() : 20);
        user.setUsedLeaveDays(0);
        user.setDepartment(userDTO.getDepartment());
        user.setEnabled(true);

        return userRepository.save(user);
    }

    /** HR-only creation that allows setting role, manager, and leave allotment directly. */
    
    @Transactional
    public User createUserAsHr(UserDTO userDTO) {
        // ── BLOCK duplicate HR_ADMIN ─────────────────────────────
        if (userDTO.getRole() == User.Role.HR_ADMIN) {
            long count = userRepository.findByRole(User.Role.HR_ADMIN).size();
            if (count >= 1) {
                throw new IllegalArgumentException(
                    "Only one HR Admin is allowed. Update application.properties to change the HR Admin account.");
            }
        }
        // ─────────────────────────────────────────────────────────

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        // ... rest of method stays the same

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : User.Role.EMPLOYEE);
        user.setHireDate(userDTO.getHireDate() != null ? userDTO.getHireDate() : LocalDate.now());
        user.setTotalLeaveDays(userDTO.getTotalLeaveDays() != null ? userDTO.getTotalLeaveDays() : 20);
        user.setUsedLeaveDays(0);
        user.setDepartment(userDTO.getDepartment());
        user.setEnabled(true);

        if (userDTO.getManagerId() != null) {
            user.setManager(getUserById(userDTO.getManagerId()));
        }

        return userRepository.save(user);
    }

    @Transactional
    public User updateUserAsHr(Long userId, UserDTO userDTO) {
        User user = getUserById(userId);

        if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
        if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
        if (userDTO.getRole() != null) user.setRole(userDTO.getRole());
        if (userDTO.getDepartment() != null) user.setDepartment(userDTO.getDepartment());
        if (userDTO.getTotalLeaveDays() != null) user.setTotalLeaveDays(userDTO.getTotalLeaveDays());
        if (userDTO.getManagerId() != null) {
            if (userDTO.getManagerId().equals(userId)) {
                throw new IllegalArgumentException("A user cannot be their own manager");
            }
            user.setManager(getUserById(userDTO.getManagerId()));
        }

        return userRepository.save(user);
    }

    @Transactional
    public void setUserEnabled(Long userId, boolean enabled) {
        User user = getUserById(userId);
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    public List<User> getDirectReports(Long managerId) {
        return userRepository.findByManagerId(managerId);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public void updateUsedLeaveDays(Long userId, Integer days) {
        if (days == null) return;
        User user = getUserById(userId);
        int updated = user.getUsedLeaveDays() + days;
        if (updated < 0) updated = 0;
        user.setUsedLeaveDays(updated);
        userRepository.save(user);
    }

    public List<UserDTO> toDtoList(List<User> users) {
        return users.stream().map(UserDTO::fromUser).collect(Collectors.toList());
    }
}