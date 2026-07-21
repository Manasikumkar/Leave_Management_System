import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const leaveService = {
  // ── Employee ──────────────────────────────────────────────────────────────
  getMyLeaveRequests:  () => api.get(API_ENDPOINTS.LEAVE_REQUESTS).then(r => r.data),
  getLeaveRequestById: (id) => api.get(API_ENDPOINTS.LEAVE_REQUEST_BY_ID(id)).then(r => r.data),
  createLeaveRequest:  (data) => api.post(API_ENDPOINTS.LEAVE_REQUESTS, data).then(r => r.data),
  cancelLeaveRequest:  (id) => api.delete(API_ENDPOINTS.CANCEL_LEAVE(id)).then(r => r.data),
  getLeaveBalance:     () => api.get(API_ENDPOINTS.LEAVE_BALANCE).then(r => r.data),

  // ── Leave Advance ─────────────────────────────────────────────────────────
  getMyAdvances:   () => api.get(API_ENDPOINTS.MY_LEAVE_ADVANCES).then(r => r.data),
  requestAdvance:  (data) => api.post(API_ENDPOINTS.REQUEST_ADVANCE, data).then(r => r.data),

  // ── Leave Donation ────────────────────────────────────────────────────────
  getMyDonationsSent:     () => api.get(API_ENDPOINTS.MY_DONATIONS_SENT).then(r => r.data),
  getMyDonationsReceived: () => api.get(API_ENDPOINTS.MY_DONATIONS_RECEIVED).then(r => r.data),
  donateLeave:            (data) => api.post(API_ENDPOINTS.DONATE_LEAVE, data).then(r => r.data),

  // ── Manager ───────────────────────────────────────────────────────────────
  getPendingLeaves: () => api.get(API_ENDPOINTS.PENDING_LEAVES).then(r => r.data),
  getAllLeaves:      () => api.get(API_ENDPOINTS.ALL_LEAVES).then(r => r.data),
  approveLeave:     (id, comments) => api.put(API_ENDPOINTS.APPROVE_LEAVE(id), { comments }).then(r => r.data),
  rejectLeave:      (id, comments) => api.put(API_ENDPOINTS.REJECT_LEAVE(id),  { comments }).then(r => r.data),
  getTeamCalendar:  (start, end) => api.get(API_ENDPOINTS.TEAM_CALENDAR, { params: { start, end } }).then(r => r.data),
  getTeamMembers:   () => api.get(API_ENDPOINTS.TEAM_MEMBERS).then(r => r.data),
};
