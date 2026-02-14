export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY;

export const LEAVE_TYPES = {
  VACATION: 'Vacation',
  SICK: 'Sick Leave',
  PERSONAL: 'Personal Leave',
  MATERNITY: 'Maternity Leave',
  PATERNITY: 'Paternity Leave',
  BEREAVEMENT: 'Bereavement Leave'
};

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled'
};

export const USER_ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER'
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VALIDATE_TOKEN: '/auth/validate',
  CURRENT_USER: '/users/me',
  LEAVE_BALANCE: '/users/me/leave-balance',
  LEAVE_REQUESTS: '/leaves',
  LEAVE_REQUEST_BY_ID: (id) => `/leaves/${id}`,
  CANCEL_LEAVE: (id) => `/leaves/${id}/cancel`,
  PENDING_LEAVES: '/manager/leaves/pending',
  ALL_LEAVES: '/manager/leaves',
  APPROVE_LEAVE: (id) => `/manager/leaves/${id}/approve`,
  REJECT_LEAVE: (id) => `/manager/leaves/${id}/reject`
};