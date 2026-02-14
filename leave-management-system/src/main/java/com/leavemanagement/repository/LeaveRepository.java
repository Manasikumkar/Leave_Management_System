package com.leavemanagement.repository;

import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveRequest.Status status);
    List<LeaveRequest> findByEmployeeAndStartDateBetween(User employee, LocalDate start, LocalDate end);
    
    @Query("SELECT l FROM LeaveRequest l WHERE l.employee.id = :employeeId AND " +
           "YEAR(l.startDate) = YEAR(CURRENT_DATE)")
    List<LeaveRequest> findCurrentYearLeavesByEmployee(@Param("employeeId") Long employeeId);
    
    @Query("SELECT l FROM LeaveRequest l WHERE l.employee.id = :employeeId AND " +
           "l.status = 'APPROVED'")
    List<LeaveRequest> findApprovedLeavesByEmployee(@Param("employeeId") Long employeeId);
    
    @Query("SELECT COALESCE(SUM(l.numberOfDays), 0) FROM LeaveRequest l WHERE " +
           "l.employee.id = :employeeId AND l.status = 'APPROVED' AND " +
           "YEAR(l.startDate) = YEAR(CURRENT_DATE)")
    Integer countUsedLeaveDays(@Param("employeeId") Long employeeId);
}