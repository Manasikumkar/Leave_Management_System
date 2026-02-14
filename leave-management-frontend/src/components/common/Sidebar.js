import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isManager = user?.role === USER_ROLES.MANAGER;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/leaves', label: 'My Leaves', icon: '📋' },
    { path: '/leave/new', label: 'Request Leave', icon: '➕' },
    ...(isManager ? [
      { path: '/manager/pending', label: 'Pending Leaves', icon: '⏳' },
      { path: '/manager/all', label: 'All Leaves', icon: '📊' }
    ] : [])
  ];

  return (
    <div className="sidebar bg-light border-end" style={{ width: '250px', minHeight: 'calc(100vh - 56px)' }}>
      <div className="p-3">
        <h6 className="text-uppercase text-muted mb-3">Menu</h6>
        <Nav className="flex-column">
          {menuItems.map((item) => (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`mb-2 ${location.pathname === item.path ? 'active bg-primary text-white' : 'text-dark'}`}
              style={{ borderRadius: '4px', padding: '10px 15px' }}
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
        
        <div className="mt-5">
          <h6 className="text-uppercase text-muted mb-3">Leave Balance</h6>
          <div className="p-3 bg-white rounded border">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">Remaining:</span>
              <strong className="text-success">{user?.remainingLeaveDays || 0} days</strong>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${Math.min(100, (user?.remainingLeaveDays || 0) * 5)}%` }}
                aria-valuenow={user?.remainingLeaveDays || 0}
                aria-valuemin="0"
                aria-valuemax="30"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;