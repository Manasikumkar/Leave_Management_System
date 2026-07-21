package com.leavemanagement.repository;

import com.leavemanagement.entity.LeaveAdvance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveAdvanceRepository extends JpaRepository<LeaveAdvance, Long> {
    List<LeaveAdvance> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<LeaveAdvance> findByStatusOrderByCreatedAtDesc(LeaveAdvance.Status status);
}
