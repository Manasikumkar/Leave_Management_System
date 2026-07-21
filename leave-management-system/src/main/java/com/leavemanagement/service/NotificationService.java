package com.leavemanagement.service;

import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Notification service for leave lifecycle events.
 *
 * Currently logs all notifications to the console.
 * To enable real email delivery, see the instructions at the bottom of this file.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void notifyLeaveSubmitted(LeaveRequest leaveRequest) {
        User employee = leaveRequest.getEmployee();

        log.info("[NOTIFY] Leave submitted — to: {} | type: {} | dates: {} to {}",
                employee.getEmail(),
                leaveRequest.getLeaveType(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate());

        if (employee.getManager() != null) {
            log.info("[NOTIFY] Approval required — to: {} | employee: {} {} | type: {} | dates: {} to {}",
                    employee.getManager().getEmail(),
                    employee.getFirstName(), employee.getLastName(),
                    leaveRequest.getLeaveType(),
                    leaveRequest.getStartDate(),
                    leaveRequest.getEndDate());
        }
    }

    public void notifyLeaveStatusChanged(LeaveRequest leaveRequest) {
        User employee = leaveRequest.getEmployee();
        log.info("[NOTIFY] Leave {} — to: {} | type: {} | dates: {} to {} | comments: {}",
                leaveRequest.getStatus(),
                employee.getEmail(),
                leaveRequest.getLeaveType(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getManagerComments());
    }

    public void notifyApprovalReminder(LeaveRequest leaveRequest) {
        if (leaveRequest.getEmployee().getManager() == null) return;
        log.info("[NOTIFY] Reminder — to: {} | pending approval for: {} {}",
                leaveRequest.getEmployee().getManager().getEmail(),
                leaveRequest.getEmployee().getFirstName(),
                leaveRequest.getEmployee().getLastName());
    }

    public void notifyGeneric(String toEmail, String subject, String body) {
        log.info("[NOTIFY] {} — to: {} | body: {}", subject, toEmail, body);
    }
}

/*
 * ─── HOW TO ENABLE REAL EMAIL DELIVERY ──────────────────────────────────────
 *
 * 1. Add to pom.xml:
 *
 *      <dependency>
 *          <groupId>org.springframework.boot</groupId>
 *          <artifactId>spring-boot-starter-mail</artifactId>
 *      </dependency>
 *
 * 2. Add to application.properties:
 *
 *      notification.mail.enabled=true
 *      notification.mail.from=no-reply@yourcompany.com
 *      spring.mail.host=smtp.gmail.com
 *      spring.mail.port=587
 *      spring.mail.username=your-email@gmail.com
 *      spring.mail.password=your-app-password
 *      spring.mail.properties.mail.smtp.auth=true
 *      spring.mail.properties.mail.smtp.starttls.enable=true
 *
 * 3. Replace this class with the EmailNotificationService shown below
 *    (copy it into this file or a new file):
 *
 *  import org.springframework.mail.SimpleMailMessage;
 *  import org.springframework.mail.javamail.JavaMailSender;
 *  import org.springframework.scheduling.annotation.Async;
 *
 *  @Service
 *  public class NotificationService {
 *      private final JavaMailSender mailSender;
 *      @Value("${notification.mail.from}") private String from;
 *
 *      public NotificationService(JavaMailSender mailSender) {
 *          this.mailSender = mailSender;
 *      }
 *
 *      @Async
 *      public void notifyGeneric(String to, String subject, String body) {
 *          SimpleMailMessage msg = new SimpleMailMessage();
 *          msg.setFrom(from); msg.setTo(to);
 *          msg.setSubject(subject); msg.setText(body);
 *          mailSender.send(msg);
 *      }
 *      // ... add the other notify methods the same way
 *  }
 */
