package com.leavemanagement.dto;

import com.leavemanagement.entity.User;

public class AuthResponse {
    private String token;
    private UserDTO user;
    
    public AuthResponse() {
    }
    
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDTO getUser() {
        return user;
    }
    
    public void setUser(UserDTO user) {
        this.user = user;
    }
    
    public static class UserDTO {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private Integer remainingLeaveDays;
        
        public UserDTO() {
        }
        
        public UserDTO(Long id, String email, String firstName, String lastName, 
                      String role, Integer remainingLeaveDays) {
            this.id = id;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.role = role;
            this.remainingLeaveDays = remainingLeaveDays;
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getFirstName() {
            return firstName;
        }
        
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
        
        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
        
        public Integer getRemainingLeaveDays() {
            return remainingLeaveDays;
        }
        
        public void setRemainingLeaveDays(Integer remainingLeaveDays) {
            this.remainingLeaveDays = remainingLeaveDays;
        }
        
        public static UserDTO fromUser(User user) {
            return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name(),
                user.getRemainingLeaveDays()
            );
        }
    }
    
    // Simple static factory method instead of builder
    public static AuthResponse create(String token, User user) {
        return new AuthResponse(token, UserDTO.fromUser(user));
    }
}