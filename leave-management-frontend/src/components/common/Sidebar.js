import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path) => location.pathname === path;
  const NavItem = ({ path, icon, label }) => (
    <Link to={path} className={`sidebar-item${isActive(path) ? ' active' : ''}`}>
      <span className="item-icon">{icon}</span>{label}
    </Link>
  );
  const used  = user?.remainingLeaveDays ?? 0;
  const total = user?.totalLeaveDays ?? 20;
  const pct   = Math.min(100, Math.round((used / total) * 100));

  const employeeMenu = [
    { path:'/dashboard',      icon:'🏠', label:'Dashboard' },
    { path:'/leaves',         icon:'📋', label:'My Leaves' },
    { path:'/leave/new',      icon:'➕', label:'Apply Leave' },
    { path:'/leave/balance',  icon:'💰', label:'Leave Balance' },
    { path:'/leave/advances', icon:'⏫', label:'Leave Advance' },
    { path:'/leave/donate',   icon:'🤝', label:'Leave Donation' },
  ];

  const hrMenu = [
    { path:'/hr',              icon:'🎛️',  label:'HR Dashboard' },
    { path:'/hr/users',        icon:'👥', label:'Employees' },
    { path:'/manager/pending', icon:'⏳', label:'Pending Leaves' },
    { path:'/manager/all',     icon:'📁', label:'All Leaves' },
    { path:'/hr/policies',     icon:'📜', label:'Leave Policies' },
    { path:'/hr/advances',     icon:'⏫', label:'Leave Advances' },
    { path:'/hr/donations',    icon:'🤝', label:'Leave Donations' },
    { path:'/hr/reports',      icon:'📈', label:'Reports' },
    { path:'/hr/calendar',     icon:'🗓️',  label:'Company Calendar' },
  ];

  if (user?.role === 'HR_ADMIN') {
    return (
      <div className="app-sidebar">
        <div className="sidebar-section-label">HR Admin Panel</div>
        {hrMenu.map(item => <NavItem key={item.path} {...item} />)}
      </div>
    );
  }

  return (
    <div className="app-sidebar">
      <div className="sidebar-section-label">My Account</div>
      {employeeMenu.map(item => <NavItem key={item.path} {...item} />)}
      <div className="sidebar-balance-box">
        <div className="sidebar-balance-label">Leave Balance</div>
        <div className="sidebar-balance-value">{used}</div>
        <div className="sidebar-balance-sub">of {total} days remaining</div>
        <div className="sidebar-progress">
          <div className="sidebar-progress-bar" style={{ width:`${pct}%` }} />
        </div>
      </div>
    </div>
  );
};
export default Sidebar;


