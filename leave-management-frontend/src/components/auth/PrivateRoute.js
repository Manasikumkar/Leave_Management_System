import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = ({ roles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PrivateRoute;