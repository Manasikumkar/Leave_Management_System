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
    
    @Transactional
    public User registerUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : User.Role.EMPLOYEE);
        user.setHireDate(userDTO.getHireDate() != null ? userDTO.getHireDate() : LocalDate.now());
        user.setTotalLeaveDays(userDTO.getTotalLeaveDays() != null ? userDTO.getTotalLeaveDays() : 20);
        user.setUsedLeaveDays(0);
        
        return userRepository.save(user);
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
        User user = getUserById(userId);
        user.setUsedLeaveDays(user.getUsedLeaveDays() + days);
        userRepository.save(user);
    }
}