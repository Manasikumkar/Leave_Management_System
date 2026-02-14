import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import CustomNavbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <CustomNavbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Container fluid>
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;