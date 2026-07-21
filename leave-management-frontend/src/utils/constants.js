

// export const API_BASE_URL = 'http://localhost:8080/api';

// export const TOKEN_KEY = 'lms_token';

// export const USER_ROLES = {
//   EMPLOYEE: 'EMPLOYEE',
//   MANAGER: 'MANAGER',
//   HR_ADMIN: 'HR_ADMIN'
// };

// export const LEAVE_TYPES = {
//   VACATION: 'Vacation',
//   SICK: 'Sick Leave',
//   PERSONAL: 'Personal',
//   MATERNITY: 'Maternity',
//   PATERNITY: 'Paternity',
//   BEREAVEMENT: 'Bereavement'
// };

// export const LEAVE_STATUS = {
//   PENDING: 'PENDING',
//   APPROVED: 'APPROVED',
//   REJECTED: 'REJECTED',
//   CANCELLED: 'CANCELLED'
// };

// export const API_ENDPOINTS = {
//   // Auth
//   LOGIN: '/auth/login',
//   REGISTER: '/auth/register',
//   VALIDATE_TOKEN: '/auth/validate',

//   // User
//   CURRENT_USER: '/users/me',
//   LEAVE_BALANCE: '/users/me/leave-balance',
//   USER_BY_ID: (id) => `/users/${id}`,

//   // Employee - Leaves
//   LEAVE_REQUESTS: '/leaves',
//   LEAVE_REQUEST_BY_ID: (id) => `/leaves/${id}`,
//   CANCEL_LEAVE: (id) => `/leaves/${id}/cancel`,

//   // Employee - Leave Advance
//   MY_LEAVE_ADVANCES: '/users/me/leave-advances',
//   REQUEST_ADVANCE: '/users/me/leave-advances',

//   // Employee - Leave Donation
//   MY_DONATIONS_SENT: '/users/me/leave-donations/sent',
//   MY_DONATIONS_RECEIVED: '/users/me/leave-donations/received',
//   DONATE_LEAVE: '/users/me/leave-donations',

//   // Manager
//   PENDING_LEAVES: '/manager/leaves/pending',
//   ALL_LEAVES: '/manager/leaves',
//   APPROVE_LEAVE: (id) => `/manager/leaves/${id}/approve`,
//   REJECT_LEAVE: (id) => `/manager/leaves/${id}/reject`,
//   TEAM_CALENDAR: '/manager/team-calendar',
//   TEAM_MEMBERS: '/manager/team',

//   // HR Admin
//   HR_USERS: '/hr/users',
//   ALL_USERS: '/users/all',
//   HR_USER_BY_ID: (id) => `/hr/users/${id}`,
//   HR_USER_STATUS: (id) => `/hr/users/${id}/status`,
//   HR_USER_ALLOWANCE: (id) => `/hr/users/${id}/leave-allowance`,
//   HR_POLICIES: '/hr/policies',
//   HR_POLICY_BY_ID: (id) => `/hr/policies/${id}`,
//   HR_ADVANCES_PENDING: '/hr/leave-advances/pending',
//   HR_ADVANCES_ALL: '/hr/leave-advances',
//   HR_ADVANCE_APPROVE: (id) => `/hr/leave-advances/${id}/approve`,
//   HR_ADVANCE_REJECT: (id) => `/hr/leave-advances/${id}/reject`,
//   HR_DONATIONS_PENDING: '/hr/leave-donations/pending',
//   HR_DONATIONS_ALL: '/hr/leave-donations',
//   HR_DONATION_APPROVE: (id) => `/hr/leave-donations/${id}/approve`,
//   HR_DONATION_REJECT: (id) => `/hr/leave-donations/${id}/reject`,
//   HR_REPORTS: '/hr/reports',
//   HR_CALENDAR: '/hr/calendar',
// };


export const API_BASE_URL = 'http://localhost:8080/api';

export const TOKEN_KEY = 'lms_token';

export const USER_ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
  HR_ADMIN: 'HR_ADMIN'
};

export const LEAVE_TYPES = {
  VACATION: 'Vacation',
  SICK: 'Sick Leave',
  PERSONAL: 'Personal',
  MATERNITY: 'Maternity',
  PATERNITY: 'Paternity',
  BEREAVEMENT: 'Bereavement'
};

export const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VALIDATE_TOKEN: '/auth/validate',

  // User
  CURRENT_USER: '/users/me',
  LEAVE_BALANCE: '/users/me/leave-balance',
  USER_BY_ID: (id) => `/users/${id}`,

  // Employee - Leaves
  LEAVE_REQUESTS: '/leaves',
  LEAVE_REQUEST_BY_ID: (id) => `/leaves/${id}`,
  CANCEL_LEAVE: (id) => `/leaves/${id}/cancel`,

  // Employee - Leave Advance
  MY_LEAVE_ADVANCES: '/users/me/leave-advances',
  REQUEST_ADVANCE: '/users/me/leave-advances',

  // Employee - Leave Donation
  MY_DONATIONS_SENT: '/users/me/leave-donations/sent',
  MY_DONATIONS_RECEIVED: '/users/me/leave-donations/received',
  DONATE_LEAVE: '/users/me/leave-donations',

  // Manager
  PENDING_LEAVES: '/manager/leaves/pending',
  ALL_LEAVES: '/manager/leaves',
  APPROVE_LEAVE: (id) => `/manager/leaves/${id}/approve`,
  REJECT_LEAVE: (id) => `/manager/leaves/${id}/reject`,
  TEAM_CALENDAR: '/manager/team-calendar',
  TEAM_MEMBERS: '/manager/team',

  // HR Admin
  HR_USERS: '/hr/users',
  HR_USER_BY_ID: (id) => `/hr/users/${id}`,
  HR_USER_STATUS: (id) => `/hr/users/${id}/status`,
  HR_USER_ALLOWANCE: (id) => `/hr/users/${id}/leave-allowance`,
  HR_POLICIES: '/hr/policies',
  HR_POLICY_BY_ID: (id) => `/hr/policies/${id}`,
  HR_ADVANCES_PENDING: '/hr/leave-advances/pending',
  HR_ADVANCES_ALL: '/hr/leave-advances',
  HR_ADVANCE_APPROVE: (id) => `/hr/leave-advances/${id}/approve`,
  HR_ADVANCE_REJECT: (id) => `/hr/leave-advances/${id}/reject`,
  HR_DONATIONS_PENDING: '/hr/leave-donations/pending',
  HR_DONATIONS_ALL: '/hr/leave-donations',
  HR_DONATION_APPROVE: (id) => `/hr/leave-donations/${id}/approve`,
  HR_DONATION_REJECT: (id) => `/hr/leave-donations/${id}/reject`,
  HR_REPORTS: '/hr/reports',
  HR_CALENDAR: '/hr/calendar',
};

