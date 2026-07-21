package com.leavemanagement.service;

import com.leavemanagement.dto.LeavePolicyDTO;
import com.leavemanagement.entity.LeavePolicy;
import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.repository.LeavePolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeavePolicyService {

    private final LeavePolicyRepository leavePolicyRepository;

    public LeavePolicyService(LeavePolicyRepository leavePolicyRepository) {
        this.leavePolicyRepository = leavePolicyRepository;
    }

    public List<LeavePolicyDTO> getAllPolicies() {
        return leavePolicyRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public LeavePolicyDTO getPolicyByLeaveType(LeaveRequest.LeaveType leaveType) {
        LeavePolicy policy = leavePolicyRepository.findByLeaveType(leaveType)
                .orElseThrow(() -> new RuntimeException("No policy configured for: " + leaveType));
        return toDTO(policy);
    }

    @Transactional
    public LeavePolicyDTO createOrUpdatePolicy(LeavePolicyDTO dto) {
        LeavePolicy policy = leavePolicyRepository.findByLeaveType(dto.getLeaveType())
                .orElse(new LeavePolicy());

        policy.setLeaveType(dto.getLeaveType());
        policy.setDefaultAnnualDays(dto.getDefaultAnnualDays());
        policy.setMaxConsecutiveDays(dto.getMaxConsecutiveDays());
        policy.setCarryForwardAllowed(dto.isCarryForwardAllowed());
        policy.setMaxCarryForwardDays(dto.getMaxCarryForwardDays() != null ? dto.getMaxCarryForwardDays() : 0);
        policy.setRequiresApproval(dto.isRequiresApproval());

        return toDTO(leavePolicyRepository.save(policy));
    }

    @Transactional
    public void deletePolicy(Long id) {
        if (!leavePolicyRepository.existsById(id)) {
            throw new RuntimeException("Policy not found with id: " + id);
        }
        leavePolicyRepository.deleteById(id);
    }

    private LeavePolicyDTO toDTO(LeavePolicy p) {
        LeavePolicyDTO dto = new LeavePolicyDTO();
        dto.setId(p.getId());
        dto.setLeaveType(p.getLeaveType());
        dto.setDefaultAnnualDays(p.getDefaultAnnualDays());
        dto.setMaxConsecutiveDays(p.getMaxConsecutiveDays());
        dto.setCarryForwardAllowed(p.isCarryForwardAllowed());
        dto.setMaxCarryForwardDays(p.getMaxCarryForwardDays());
        dto.setRequiresApproval(p.isRequiresApproval());
        return dto;
    }
}
