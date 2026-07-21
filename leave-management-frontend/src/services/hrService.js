import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const hrService = {
  // ── Users ─────────────────────────────────────────────────────────────────
  getAllUsers: () => api.get(API_ENDPOINTS.HR_USERS).then(r => r.data),
getAllUsersPublic: () => api.get(API_ENDPOINTS.ALL_USERS).then(r => r.data),
  getUsersByRole:   (role) => api.get(API_ENDPOINTS.HR_USERS + '/by-role', { params: { role } }).then(r => r.data),
  createUser:       (data) => api.post(API_ENDPOINTS.HR_USERS, data).then(r => r.data),
  updateUser:       (id, data) => api.put(API_ENDPOINTS.HR_USER_BY_ID(id), data).then(r => r.data),
  setUserStatus:    (id, enabled) => api.patch(API_ENDPOINTS.HR_USER_STATUS(id), { enabled }).then(r => r.data),
  setLeaveAllowance:(id, totalLeaveDays) => api.patch(API_ENDPOINTS.HR_USER_ALLOWANCE(id), { totalLeaveDays }).then(r => r.data),

  // ── Leave Policies ────────────────────────────────────────────────────────
  getAllPolicies:         () => api.get(API_ENDPOINTS.HR_POLICIES).then(r => r.data),
  createOrUpdatePolicy:  (data) => api.post(API_ENDPOINTS.HR_POLICIES, data).then(r => r.data),
  deletePolicy:          (id) => api.delete(API_ENDPOINTS.HR_POLICY_BY_ID(id)).then(r => r.data),

  // ── Leave Advances ────────────────────────────────────────────────────────
  getPendingAdvances: () => api.get(API_ENDPOINTS.HR_ADVANCES_PENDING).then(r => r.data),
  getAllAdvances:      () => api.get(API_ENDPOINTS.HR_ADVANCES_ALL).then(r => r.data),
  approveAdvance:     (id, comments) => api.put(API_ENDPOINTS.HR_ADVANCE_APPROVE(id), { comments }).then(r => r.data),
  rejectAdvance:      (id, comments) => api.put(API_ENDPOINTS.HR_ADVANCE_REJECT(id),  { comments }).then(r => r.data),

  // ── Leave Donations ───────────────────────────────────────────────────────
  getPendingDonations: () => api.get(API_ENDPOINTS.HR_DONATIONS_PENDING).then(r => r.data),
  getAllDonations:      () => api.get(API_ENDPOINTS.HR_DONATIONS_ALL).then(r => r.data),
  approveDonation:     (id) => api.put(API_ENDPOINTS.HR_DONATION_APPROVE(id)).then(r => r.data),
  rejectDonation:      (id) => api.put(API_ENDPOINTS.HR_DONATION_REJECT(id)).then(r => r.data),

  // ── Reports & Calendar ────────────────────────────────────────────────────
  getReport:          (from, to) => api.get(API_ENDPOINTS.HR_REPORTS, { params: { from, to } }).then(r => r.data),
  getCompanyCalendar: (start, end) => api.get(API_ENDPOINTS.HR_CALENDAR, { params: { start, end } }).then(r => r.data),
};
