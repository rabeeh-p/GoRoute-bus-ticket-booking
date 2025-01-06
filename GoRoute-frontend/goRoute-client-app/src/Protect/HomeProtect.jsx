import React from 'react';
import { Navigate } from 'react-router-dom';

const HomeProtect = ({ children }) => {
  const userType = localStorage.getItem('userType');  

  if (userType === 'super_admin') {
    return <Navigate to="/admin-home" />;
  }

  if (userType === 'bus_owner') {
    return <Navigate to="/busowner-dashboard" />;
  }

  return children;
};

export default HomeProtect;
