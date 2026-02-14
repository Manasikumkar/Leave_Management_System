import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const leaveService = {
  // Employee endpoints
  getMyLeaveRequests: async () => {
    const response = await api.get(API_ENDPOINTS.LEAVE_REQUESTS);
    return response.data;
  },

  getLeaveRequestById: async (id) => {
    const response = await api.get(API_ENDPOINTS.LEAVE_REQUEST_BY_ID(id));
    return response.data;
  },

  createLeaveRequest: async (leaveData) => {
    const response = await api.post(API_ENDPOINTS.LEAVE_REQUESTS, leaveData);
    return response.data;
  },

  cancelLeaveRequest: async (id) => {
    const response = await api.delete(API_ENDPOINTS.CANCEL_LEAVE(id));
    return response.data;
  },

  getLeaveBalance: async () => {
    const response = await api.get(API_ENDPOINTS.LEAVE_BALANCE);
    return response.data;
  },

  // Manager endpoints
  getPendingLeaves: async () => {
    const response = await api.get(API_ENDPOINTS.PENDING_LEAVES);
    return response.data;
  },

  getAllLeaves: async () => {
    const response = await api.get(API_ENDPOINTS.ALL_LEAVES);
    return response.data;
  },

  approveLeave: async (id, comments) => {
    const response = await api.put(API_ENDPOINTS.APPROVE_LEAVE(id), { comments });
    return response.data;
  },

  rejectLeave: async (id, comments) => {
    const response = await api.put(API_ENDPOINTS.REJECT_LEAVE(id), { comments });
    return response.data;
  }
};