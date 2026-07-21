import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomNavbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = () => {
  const { loading } = useAuth();

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="app-wrapper">
      <CustomNavbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
