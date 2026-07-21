package com.leavemanagement.dto;

import com.leavemanagement.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class UserDTO {

    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    // Only required on registration; never returned in responses
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private User.Role role;
    private LocalDate hireDate;
    private Integer totalLeaveDays;
    private Integer usedLeaveDays;
    private Integer remainingLeaveDays;
    private Long managerId;
    private String managerName;
    private String department;
    private boolean enabled;

    public UserDTO() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }
    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }
    public Integer getTotalLeaveDays() { return totalLeaveDays; }
    public void setTotalLeaveDays(Integer totalLeaveDays) { this.totalLeaveDays = totalLeaveDays; }
    public Integer getUsedLeaveDays() { return usedLeaveDays; }
    public void setUsedLeaveDays(Integer usedLeaveDays) { this.usedLeaveDays = usedLeaveDays; }
    public Integer getRemainingLeaveDays() { return remainingLeaveDays; }
    public void setRemainingLeaveDays(Integer remainingLeaveDays) { this.remainingLeaveDays = remainingLeaveDays; }
    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }
    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    /** Converts an entity to a DTO. Password is intentionally never populated. */
    public static UserDTO fromUser(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        dto.setHireDate(user.getHireDate());
        dto.setTotalLeaveDays(user.getTotalLeaveDays());
        dto.setUsedLeaveDays(user.getUsedLeaveDays());
        dto.setRemainingLeaveDays(user.getRemainingLeaveDays());
        dto.setDepartment(user.getDepartment());
        dto.setEnabled(user.isEnabled());
        if (user.getManager() != null) {
            dto.setManagerId(user.getManager().getId());
            dto.setManagerName(user.getManager().getFirstName() + " " + user.getManager().getLastName());
        }
        return dto;
    }
}
