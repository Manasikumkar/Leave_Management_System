package com.leavemanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, Object> errors = new HashMap<>();
        Map<String, String> fieldErrors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });
        
        errors.put("timestamp", LocalDateTime.now());
        errors.put("status", HttpStatus.BAD_REQUEST.value());
        errors.put("error", "Validation Failed");
        errors.put("message", "Input validation failed");
        errors.put("fieldErrors", fieldErrors);
        
        return ResponseEntity.badRequest().body(errors);
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialsException(
            BadCredentialsException ex) {
        Map<String, Object> errors = new HashMap<>();
        
        errors.put("timestamp", LocalDateTime.now());
        errors.put("status", HttpStatus.UNAUTHORIZED.value());
        errors.put("error", "Unauthorized");
        errors.put("message", "Invalid email or password");
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errors);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex) {
        Map<String, Object> errors = new HashMap<>();
        
        errors.put("timestamp", LocalDateTime.now());
        errors.put("status", HttpStatus.BAD_REQUEST.value());
        errors.put("error", "Bad Request");
        errors.put("message", ex.getMessage());
        
        return ResponseEntity.badRequest().body(errors);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex) {
        Map<String, Object> errors = new HashMap<>();
        
        errors.put("timestamp", LocalDateTime.now());
        errors.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errors.put("error", "Internal Server Error");
        errors.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(
            Exception ex) {
        Map<String, Object> errors = new HashMap<>();
        
        errors.put("timestamp", LocalDateTime.now());
        errors.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errors.put("error", "Internal Server Error");
        errors.put("message", "An unexpected error occurred");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
    }
}