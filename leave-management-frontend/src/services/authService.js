import api from './api';
import { API_ENDPOINTS, TOKEN_KEY } from '../utils/constants';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CURRENT_USER);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  validateToken: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return null;
      
      const response = await api.get(API_ENDPOINTS.VALIDATE_TOKEN, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  }
};