package com.leavemanagement.dto;

import com.leavemanagement.entity.LeaveDonation;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class LeaveDonationDTO {
    private Long id;

    @NotNull(message = "Recipient is required")
    private Long recipientId;

    @NotNull(message = "Days donated is required")
    @Min(value = 1, message = "Must donate at least 1 day")
    private Integer daysDonated;

    private String reason;
    private LeaveDonation.Status status;
    private Long donorId;
    private String donorName;
    private String recipientName;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
    public Integer getDaysDonated() { return daysDonated; }
    public void setDaysDonated(Integer daysDonated) { this.daysDonated = daysDonated; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public LeaveDonation.Status getStatus() { return status; }
    public void setStatus(LeaveDonation.Status status) { this.status = status; }
    public Long getDonorId() { return donorId; }
    public void setDonorId(Long donorId) { this.donorId = donorId; }
    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
