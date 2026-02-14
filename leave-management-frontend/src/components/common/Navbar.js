import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const isManager = user?.role === USER_ROLES.MANAGER;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/">
          📊 Leave Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/leaves">
              My Leaves
            </Nav.Link>
            <Nav.Link as={Link} to="/leave/new">
              Request Leave
            </Nav.Link>
            {isManager && (
              <>
                <Nav.Link as={Link} to="/manager/pending">
                  Pending Leaves
                </Nav.Link>
                <Nav.Link as={Link} to="/manager/all">
                  All Leaves
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                👤 {user?.firstName} {user?.lastName}
                <span className="badge bg-info ms-2">
                  {user?.role}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.ItemText className="text-muted small">
                  {user?.email}
                </Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/profile">
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;