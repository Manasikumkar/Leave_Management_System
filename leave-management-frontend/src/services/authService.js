import api from './api';
import { API_ENDPOINTS, TOKEN_KEY } from '../utils/constants';

export const authService = {
  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    if (response.data.token) localStorage.setItem(TOKEN_KEY, response.data.token);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    if (response.data.token) localStorage.setItem(TOKEN_KEY, response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  },

  validateToken: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const response = await api.get(API_ENDPOINTS.VALIDATE_TOKEN);
    return response.data;
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken: () => localStorage.getItem(TOKEN_KEY)
};
