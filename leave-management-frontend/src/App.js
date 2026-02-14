import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/employee/Dashboard';
import LeaveRequestForm from './components/employee/LeaveRequestForm';
import MyLeaves from './components/employee/MyLeaves';
import LeaveBalance from './components/employee/LeaveBalance';
import ManagerDashboard from './components/manager/ManagerDashboard';
import PendingLeaves from './components/manager/PendingLeaves';
import AllLeaves from './components/manager/AllLeaves';
import { USER_ROLES } from './utils/constants';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes - Employee */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaves" element={<MyLeaves />} />
              <Route path="/leaves/:id" element={<div>Leave Detail View</div>} />
              <Route path="/leave/new" element={<LeaveRequestForm />} />
              <Route path="/leave/edit/:id" element={<LeaveRequestForm />} />
              <Route path="/balance" element={<LeaveBalance />} />
              
              {/* Manager Routes */}
              <Route element={<PrivateRoute roles={[USER_ROLES.MANAGER]} />}>
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/pending" element={<PendingLeaves />} />
                <Route path="/manager/all" element={<AllLeaves />} />
              </Route>
            </Route>
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;