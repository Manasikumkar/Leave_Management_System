package com.leavemanagement.repository;

import com.leavemanagement.entity.LeavePolicy;
import com.leavemanagement.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeavePolicyRepository extends JpaRepository<LeavePolicy, Long> {
    Optional<LeavePolicy> findByLeaveType(LeaveRequest.LeaveType leaveType);
}
