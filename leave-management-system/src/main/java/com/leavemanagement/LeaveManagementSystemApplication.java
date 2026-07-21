package com.leavemanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class LeaveManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeaveManagementSystemApplication.class, args);
        System.out.println("Compile successfully");
    }
}