import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

import AuthLayout   from './components/layout/AuthLayout';
import MainLayout   from './components/layout/MainLayout';
import PrivateRoute from './components/common/PrivateRoute';

import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard         from './pages/employee/Dashboard';
import MyLeaves          from './pages/employee/MyLeaves';
import LeaveRequestForm  from './pages/employee/LeaveRequestForm';
import LeaveBalance      from './pages/employee/LeaveBalance';
import LeaveAdvancePage  from './pages/employee/LeaveAdvancePage';
import LeaveDonationPage from './pages/employee/LeaveDonationPage';

import HrDashboard  from './pages/hr/HrDashboard';
import HrUsers      from './pages/hr/HrUsers';
import HrPolicies   from './pages/hr/HrPolicies';
import HrAdvances   from './pages/hr/HrAdvances';
import HrDonations  from './pages/hr/HrDonations';
import HrReports    from './pages/hr/HrReports';
import AllLeaves    from './pages/manager/AllLeaves';
import PendingLeaves from './pages/manager/PendingLeaves';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>

        {/* Public */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Employee routes — all authenticated users */}
        <Route element={<PrivateRoute roles={['EMPLOYEE','HR_ADMIN']} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard"      element={<Dashboard />} />
            <Route path="/leaves"         element={<MyLeaves />} />
            <Route path="/leave/new"      element={<LeaveRequestForm />} />
            <Route path="/leave/balance"  element={<LeaveBalance />} />
            <Route path="/leave/advances" element={<LeaveAdvancePage />} />
            <Route path="/leave/donate"   element={<LeaveDonationPage />} />
          </Route>
        </Route>

        {/* HR Admin only routes */}
        <Route element={<PrivateRoute roles={['HR_ADMIN']} />}>
          <Route element={<MainLayout />}>
            <Route path="/hr"              element={<HrDashboard />} />
            <Route path="/hr/users"        element={<HrUsers />} />
            <Route path="/hr/policies"     element={<HrPolicies />} />
            <Route path="/hr/advances"     element={<HrAdvances />} />
            <Route path="/hr/donations"    element={<HrDonations />} />
            <Route path="/hr/reports"      element={<HrReports />} />
            <Route path="/manager/pending" element={<PendingLeaves />} />
            <Route path="/manager/all"     element={<AllLeaves />} />
          </Route>
        </Route>

        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />

      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;