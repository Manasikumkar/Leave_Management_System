package com.leavemanagement.service;

import com.leavemanagement.dto.LeaveBalanceDTO;
import com.leavemanagement.dto.LeaveCalendarEntryDTO;
import com.leavemanagement.dto.LeaveRequestDTO;
import com.leavemanagement.dto.LeaveResponseDTO;
import com.leavemanagement.entity.LeavePolicy;
import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import com.leavemanagement.repository.LeavePolicyRepository;
import com.leavemanagement.repository.LeaveRepository;
import com.leavemanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final LeavePolicyRepository leavePolicyRepository;
    private final NotificationService notificationService;

    public LeaveService(LeaveRepository leaveRepository,
                       UserRepository userRepository,
                       UserService userService,
                       LeavePolicyRepository leavePolicyRepository,
                       NotificationService notificationService) {
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.leavePolicyRepository = leavePolicyRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public LeaveRequest createLeaveRequest(LeaveRequestDTO dto, Long employeeId) {
        User employee = userService.getUserById(employeeId);

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        long weekdays = calculateWeekdays(dto.getStartDate(), dto.getEndDate());
        int requestedDays = (int) weekdays;

        if (requestedDays <= 0) {
            throw new IllegalArgumentException("Leave duration must be at least 1 day");
        }

        Optional<LeavePolicy> policy = leavePolicyRepository.findByLeaveType(dto.getLeaveType());
        policy.ifPresent(p -> {
            if (requestedDays > p.getMaxConsecutiveDays()) {
                throw new IllegalArgumentException(
                        "Requested duration exceeds the maximum of " + p.getMaxConsecutiveDays() +
                        " consecutive days allowed for " + dto.getLeaveType());
            }
        });

        if (employee.getRemainingLeaveDays() < requestedDays) {
            throw new IllegalArgumentException("Insufficient leave balance. Available: " +
                                             employee.getRemainingLeaveDays() + " days");
        }

        List<LeaveRequest> existingLeaves = leaveRepository.findByEmployeeAndStartDateBetween(
                employee, dto.getStartDate(), dto.getEndDate());

        boolean overlapsActive = existingLeaves.stream()
                .anyMatch(l -> l.getStatus() == LeaveRequest.Status.PENDING ||
                               l.getStatus() == LeaveRequest.Status.APPROVED);
        if (overlapsActive) {
            throw new IllegalArgumentException("You already have a leave request for these dates");
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setLeaveType(dto.getLeaveType());
        leaveRequest.setStartDate(dto.getStartDate());
        leaveRequest.setEndDate(dto.getEndDate());
        leaveRequest.setNumberOfDays(requestedDays);
        leaveRequest.setReason(dto.getReason());
        leaveRequest.setStatus(LeaveRequest.Status.PENDING);
        leaveRequest.setCreatedAt(LocalDateTime.now());

        LeaveRequest saved = leaveRepository.save(leaveRequest);
        notificationService.notifyLeaveSubmitted(saved);
        return saved;
    }

    @Transactional
    public LeaveRequest updateLeaveStatus(Long leaveId, LeaveRequest.Status status,
                                         String comments, Long managerId) {
        if (status != LeaveRequest.Status.APPROVED && status != LeaveRequest.Status.REJECTED) {
            throw new IllegalArgumentException("Status must be APPROVED or REJECTED");
        }

        LeaveRequest leaveRequest = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + leaveId));

        User manager = userService.getUserById(managerId);

        // Authorization: only the employee's direct manager or an HR_ADMIN can act on a request.
//        boolean isDirectManager = leaveRequest.getEmployee().getManager() != null &&
//                leaveRequest.getEmployee().getManager().getId().equals(managerId);
//        boolean isHrAdmin = manager.getRole() == User.Role.HR_ADMIN;
//        if (!isDirectManager && !isHrAdmin) {
//            throw new IllegalArgumentException("You are not authorized to act on this leave request");
//        }
        if (manager.getRole() != User.Role.HR_ADMIN) {
            throw new IllegalArgumentException("Only HR Admin can approve or reject leave requests");
        }

        if (leaveRequest.getStatus() != LeaveRequest.Status.PENDING) {
            throw new IllegalArgumentException("Leave request is not in pending status. Current status: " +
                                             leaveRequest.getStatus());
        }

        leaveRequest.setStatus(status);
        leaveRequest.setManager(manager);
        leaveRequest.setManagerComments(comments);
        leaveRequest.setUpdatedAt(LocalDateTime.now());

        if (status == LeaveRequest.Status.APPROVED) {
            userService.updateUsedLeaveDays(
                    leaveRequest.getEmployee().getId(),
                    leaveRequest.getNumberOfDays());
        }

        LeaveRequest saved = leaveRepository.save(leaveRequest);
        notificationService.notifyLeaveStatusChanged(saved);
        return saved;
    }

    public List<LeaveResponseDTO> getLeaveRequestsByEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveResponseDTO> getPendingLeaveRequests() {
        return leaveRepository.findByStatusOrderByCreatedAtDesc(LeaveRequest.Status.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /** Pending requests scoped to a specific manager's direct reports. */
    public List<LeaveResponseDTO> getPendingLeaveRequestsForManager(Long managerId) {
        return leaveRepository.findByEmployee_ManagerIdAndStatusOrderByCreatedAtDesc(
                managerId, LeaveRequest.Status.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveResponseDTO> getAllLeaveRequestsForManager(Long managerId) {
        return leaveRepository.findByEmployee_ManagerIdOrderByCreatedAtDesc(managerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveResponseDTO> getAllLeaveRequests() {
        return leaveRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LeaveResponseDTO getLeaveRequestById(Long id) {
        LeaveRequest leaveRequest = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));
        return convertToDTO(leaveRequest);
    }

    public LeaveRequest getLeaveRequestEntityById(Long id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));
    }

    public LeaveBalanceDTO getLeaveBalance(Long employeeId) {
        User employee = userService.getUserById(employeeId);
        Integer usedDays = leaveRepository.countUsedLeaveDays(employeeId);
        if (usedDays == null) usedDays = 0;

        return new LeaveBalanceDTO(
            employee.getTotalLeaveDays(),
            usedDays,
            employee.getTotalLeaveDays() - usedDays
        );
    }

    @Transactional
    public void cancelLeaveRequest(Long leaveId, Long employeeId) {
        LeaveRequest leaveRequest = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + leaveId));

        if (!leaveRequest.getEmployee().getId().equals(employeeId)) {
            throw new IllegalArgumentException("You can only cancel your own leave requests");
        }

        if (leaveRequest.getStatus() != LeaveRequest.Status.PENDING) {
            throw new IllegalArgumentException("Only pending leave requests can be cancelled");
        }

        leaveRequest.setStatus(LeaveRequest.Status.CANCELLED);
        leaveRequest.setUpdatedAt(LocalDateTime.now());
        leaveRepository.save(leaveRequest);
    }

    public List<LeaveResponseDTO> getLeaveRequestsByStatus(LeaveRequest.Status status) {
        return leaveRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean hasOverlappingLeave(Long employeeId, LocalDate startDate, LocalDate endDate) {
        User employee = userService.getUserById(employeeId);
        List<LeaveRequest> existingLeaves = leaveRepository.findByEmployeeAndStartDateBetween(
                employee, startDate, endDate);
        return !existingLeaves.isEmpty();
    }

    /** Team leave calendar: all approved leave for a manager's direct reports within a date range. */
    public List<LeaveCalendarEntryDTO> getTeamCalendar(Long managerId, LocalDate start, LocalDate end) {
        return leaveRepository.findTeamCalendar(managerId, start, end)
                .stream()
                .map(l -> new LeaveCalendarEntryDTO(
                        l.getEmployee().getId(),
                        l.getEmployee().getFirstName() + " " + l.getEmployee().getLastName(),
                        l.getLeaveType(),
                        l.getStartDate(),
                        l.getEndDate()))
                .collect(Collectors.toList());
    }

    /** Company-wide approved leave calendar, for HR use. */
    public List<LeaveCalendarEntryDTO> getCompanyCalendar(LocalDate start, LocalDate end) {
        return leaveRepository.findApprovedLeavesInRange(start, end)
                .stream()
                .map(l -> new LeaveCalendarEntryDTO(
                        l.getEmployee().getId(),
                        l.getEmployee().getFirstName() + " " + l.getEmployee().getLastName(),
                        l.getLeaveType(),
                        l.getStartDate(),
                        l.getEndDate()))
                .collect(Collectors.toList());
    }

    private LeaveResponseDTO convertToDTO(LeaveRequest leaveRequest) {
        LeaveResponseDTO dto = new LeaveResponseDTO();

        dto.setId(leaveRequest.getId());
        dto.setLeaveType(leaveRequest.getLeaveType());
        dto.setStartDate(leaveRequest.getStartDate());
        dto.setEndDate(leaveRequest.getEndDate());
        dto.setReason(leaveRequest.getReason());
        dto.setStatus(leaveRequest.getStatus());
        dto.setNumberOfDays(leaveRequest.getNumberOfDays());
        dto.setCreatedAt(leaveRequest.getCreatedAt());
        dto.setUpdatedAt(leaveRequest.getUpdatedAt());
        dto.setManagerComments(leaveRequest.getManagerComments());

        if (leaveRequest.getEmployee() != null) {
            dto.setEmployeeId(leaveRequest.getEmployee().getId());
            dto.setEmployeeName(leaveRequest.getEmployee().getFirstName() + " " +
                               leaveRequest.getEmployee().getLastName());
        }

        if (leaveRequest.getManager() != null) {
            dto.setManagerId(leaveRequest.getManager().getId());
            dto.setManagerName(leaveRequest.getManager().getFirstName() + " " +
                              leaveRequest.getManager().getLastName());
        }

        return dto;
    }

    private long calculateWeekdays(LocalDate startDate, LocalDate endDate) {
        long weekdays = 0;
        LocalDate date = startDate;

        while (!date.isAfter(endDate)) {
            if (date.getDayOfWeek().getValue() < 6) {
                weekdays++;
            }
            date = date.plusDays(1);
        }

        return weekdays;
    }
}
