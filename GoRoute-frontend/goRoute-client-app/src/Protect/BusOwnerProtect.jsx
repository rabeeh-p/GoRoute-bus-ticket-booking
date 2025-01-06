import React from 'react';
import { Navigate } from 'react-router-dom';

const BusOwnerProtect = ({ children }) => {
  const userType = localStorage.getItem('userType');

  if (userType === 'bus_owner') {
    return children;
  }

  if (userType === 'normal_user') {
    return <Navigate to="/" />;
  }

  if (userType === 'super_admin') {
    return <Navigate to="/admin-home" />;
  }

  return <Navigate to="/login" />;
};

export default BusOwnerProtect;
