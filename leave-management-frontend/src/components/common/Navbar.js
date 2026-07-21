import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const initials  = `${user.firstName?.[0]||''}${user.lastName?.[0]||''}`.toUpperCase();
  const roleClass = user.role?.toLowerCase().replace('_','_');
  return (
    <Navbar className="app-navbar" expand="lg">
      <Container fluid style={{ padding:'0 4px' }}>
        <Navbar.Brand as={Link} to="/dashboard">
          <div className="brand-icon">📋</div>LeaveMS
        </Navbar.Brand>
        <div className="d-none d-md-flex align-items-center gap-2 ms-4" style={{ flex:1 }}>
          <span style={{ fontSize:'.8rem', color:'var(--text-3)', fontWeight:500 }}>
            {new Date().toLocaleDateString('en-IN',{ weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-md-flex align-items-center gap-2"
            style={{ background:'var(--mint-light)', borderRadius:'20px', padding:'6px 14px', border:'1px solid rgba(95,219,167,.3)' }}>
            <span style={{ fontSize:'.8rem', color:'var(--mint-dark)', fontWeight:700 }}>📅 {user.remainingLeaveDays ?? 0} days left</span>
          </div>
          <Dropdown align="end">
            <Dropdown.Toggle as="button" className="navbar-user-btn">
              <div className="user-avatar">{initials}</div>
              <div className="d-none d-md-block text-start">
                <div style={{ fontWeight:700, fontSize:'.8125rem', lineHeight:1.2, color:'var(--text-1)' }}>{user.firstName} {user.lastName}</div>
              </div>
              <span className={`role-chip ${roleClass}`}>{user.role?.replace('_',' ')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="navbar-dropdown-menu">
              <div className="navbar-email-text">
                <div style={{ fontWeight:700, color:'var(--text-1)', fontSize:'.8125rem' }}>{user.firstName} {user.lastName}</div>
                <div>{user.email}</div>
              </div>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to="/dashboard">🏠 Dashboard</Dropdown.Item>
              <Dropdown.Item as={Link} to="/leave/balance">📅 Leave Balance</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => { logout(); navigate('/login'); }} style={{ color:'var(--danger-dark)', fontWeight:600 }}>🚪 Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};
export default CustomNavbar;


