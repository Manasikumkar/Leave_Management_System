package com.leavemanagement.repository;

import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeAndStartDateBetween(User employee, LocalDate start, LocalDate end);

    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    List<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveRequest.Status status);

    List<LeaveRequest> findByEmployee_ManagerIdAndStatusOrderByCreatedAtDesc(Long managerId, LeaveRequest.Status status);

    List<LeaveRequest> findByEmployee_ManagerIdOrderByCreatedAtDesc(Long managerId);

    @Query("SELECT COALESCE(SUM(l.numberOfDays), 0) FROM LeaveRequest l " +
           "WHERE l.employee.id = :employeeId AND l.status = 'APPROVED'")
    Integer countUsedLeaveDays(@Param("employeeId") Long employeeId);

    @Query("SELECT l FROM LeaveRequest l WHERE l.status = 'APPROVED' " +
           "AND l.startDate <= :end AND l.endDate >= :start")
    List<LeaveRequest> findApprovedLeavesInRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT l FROM LeaveRequest l WHERE l.employee.manager.id = :managerId " +
           "AND l.status = 'APPROVED' AND l.startDate <= :end AND l.endDate >= :start")
    List<LeaveRequest> findTeamCalendar(@Param("managerId") Long managerId,
                                         @Param("start") LocalDate start,
                                         @Param("end") LocalDate end);

    List<LeaveRequest> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
