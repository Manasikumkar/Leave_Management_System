package com.leavemanagement.service;

import com.leavemanagement.dto.LeaveDonationDTO;
import com.leavemanagement.entity.LeaveDonation;
import com.leavemanagement.entity.User;
import com.leavemanagement.repository.LeaveDonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveDonationService {

    private final LeaveDonationRepository leaveDonationRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public LeaveDonationService(LeaveDonationRepository leaveDonationRepository,
                                UserService userService,
                                NotificationService notificationService) {
        this.leaveDonationRepository = leaveDonationRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @Transactional
    public LeaveDonationDTO donateleave(LeaveDonationDTO dto, Long donorId) {
        User donor = userService.getUserById(donorId);
        User recipient = userService.getUserById(dto.getRecipientId());

        if (donor.getId().equals(recipient.getId())) {
            throw new IllegalArgumentException("You cannot donate leave to yourself");
        }
        if (dto.getDaysDonated() == null || dto.getDaysDonated() < 1) {
            throw new IllegalArgumentException("Must donate at least 1 day");
        }
        if (donor.getRemainingLeaveDays() < dto.getDaysDonated()) {
            throw new IllegalArgumentException("Insufficient leave balance to donate. Available: "
                    + donor.getRemainingLeaveDays() + " days");
        }

        LeaveDonation donation = new LeaveDonation();
        donation.setDonor(donor);
        donation.setRecipient(recipient);
        donation.setDaysDonated(dto.getDaysDonated());
        donation.setReason(dto.getReason());
        donation.setStatus(LeaveDonation.Status.PENDING);
        donation.setCreatedAt(LocalDateTime.now());

        LeaveDonation saved = leaveDonationRepository.save(donation);

        notificationService.notifyGeneric(donor.getEmail(),
                "Leave Donation Submitted",
                String.format("Your request to donate %d day(s) to %s %s is pending HR approval.",
                        dto.getDaysDonated(), recipient.getFirstName(), recipient.getLastName()));

        return toDTO(saved);
    }

    @Transactional
    public LeaveDonationDTO reviewDonation(Long donationId, LeaveDonation.Status status, Long hrAdminId) {
        LeaveDonation donation = getEntityById(donationId);

        if (donation.getStatus() != LeaveDonation.Status.PENDING) {
            throw new IllegalArgumentException("Donation is already " + donation.getStatus());
        }
        if (status == LeaveDonation.Status.PENDING) {
            throw new IllegalArgumentException("Target status must be APPROVED or REJECTED");
        }

        User hrAdmin = userService.getUserById(hrAdminId);
        donation.setStatus(status);
        donation.setApprovedBy(hrAdmin);
        donation.setUpdatedAt(LocalDateTime.now());

        if (status == LeaveDonation.Status.APPROVED) {
            User donor = donation.getDonor();
            User recipient = donation.getRecipient();

            if (donor.getRemainingLeaveDays() < donation.getDaysDonated()) {
                throw new IllegalArgumentException(
                        "Donor no longer has sufficient balance to complete this donation");
            }
            // Deduct from donor's total, credit to recipient's total.
            donor.setTotalLeaveDays(donor.getTotalLeaveDays() - donation.getDaysDonated());
            recipient.setTotalLeaveDays(recipient.getTotalLeaveDays() + donation.getDaysDonated());
            userService.updateUsedLeaveDays(donor.getId(), 0);
            userService.updateUsedLeaveDays(recipient.getId(), 0);

            notificationService.notifyGeneric(recipient.getEmail(),
                    "Leave Donation Received",
                    String.format("%s %s has donated %d leave day(s) to you. Your new balance is %d day(s).",
                            donor.getFirstName(), donor.getLastName(),
                            donation.getDaysDonated(), recipient.getRemainingLeaveDays()));
        }

        notificationService.notifyGeneric(donation.getDonor().getEmail(),
                "Leave Donation " + status,
                String.format("Your leave donation of %d day(s) to %s %s has been %s.",
                        donation.getDaysDonated(),
                        donation.getRecipient().getFirstName(), donation.getRecipient().getLastName(),
                        status));

        return toDTO(leaveDonationRepository.save(donation));
    }

    public List<LeaveDonationDTO> getMyDonations(Long donorId) {
        return leaveDonationRepository.findByDonorIdOrderByCreatedAtDesc(donorId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<LeaveDonationDTO> getReceivedDonations(Long recipientId) {
        return leaveDonationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<LeaveDonationDTO> getPendingDonations() {
        return leaveDonationRepository.findByStatusOrderByCreatedAtDesc(LeaveDonation.Status.PENDING)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<LeaveDonationDTO> getAllDonations() {
        return leaveDonationRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private LeaveDonation getEntityById(Long id) {
        return leaveDonationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave donation not found with id: " + id));
    }

    private LeaveDonationDTO toDTO(LeaveDonation d) {
        LeaveDonationDTO dto = new LeaveDonationDTO();
        dto.setId(d.getId());
        dto.setDaysDonated(d.getDaysDonated());
        dto.setReason(d.getReason());
        dto.setStatus(d.getStatus());
        dto.setCreatedAt(d.getCreatedAt());
        if (d.getDonor() != null) {
            dto.setDonorId(d.getDonor().getId());
            dto.setDonorName(d.getDonor().getFirstName() + " " + d.getDonor().getLastName());
        }
        if (d.getRecipient() != null) {
            dto.setRecipientId(d.getRecipient().getId());
            dto.setRecipientName(d.getRecipient().getFirstName() + " " + d.getRecipient().getLastName());
        }
        return dto;
    }
}
