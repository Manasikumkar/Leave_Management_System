package com.leavemanagement.repository;

import com.leavemanagement.entity.LeaveDonation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveDonationRepository extends JpaRepository<LeaveDonation, Long> {
    List<LeaveDonation> findByDonorIdOrderByCreatedAtDesc(Long donorId);
    List<LeaveDonation> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    List<LeaveDonation> findByStatusOrderByCreatedAtDesc(LeaveDonation.Status status);
}
