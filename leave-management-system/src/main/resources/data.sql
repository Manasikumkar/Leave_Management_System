-- First, clear existing data
DELETE FROM leave_requests;
DELETE FROM users;

-- Create initial manager user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role, hire_date, total_leave_days, used_leave_days) 
VALUES (
    'manager@company.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lOBslKXRT6YI/O', 
    'John', 
    'Manager', 
    'MANAGER', 
    '2023-01-01', 
    25, 
    0
);

-- Create initial employee user (password: employee123)
INSERT INTO users (email, password, first_name, last_name, role, hire_date, total_leave_days, used_leave_days) 
VALUES (
    'employee@company.com', 
    '$2a$10$mFmH.7T5KQXqQtYq7Q.Y3OeVeJpJ7T5KQXqQtYq7Q.Y3OeVeJp', 
    'Jane', 
    'Employee', 
    'EMPLOYEE', 
    '2023-06-01', 
    20, 
    0
);