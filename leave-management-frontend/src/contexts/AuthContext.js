import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { TOKEN_KEY } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    // No token — skip validation entirely
    if (!token) { setLoading(false); return; }

    try {
      const userData = await authService.validateToken();
      setUser(userData);
    } catch {
      // Token expired or invalid — clear it silently
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData) => setUser(userData);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateUser,
      isAuthenticated: !!user,
      isEmployee: user?.role === 'EMPLOYEE',
      isManager:  user?.role === 'MANAGER',
      isHrAdmin:  user?.role === 'HR_ADMIN',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

