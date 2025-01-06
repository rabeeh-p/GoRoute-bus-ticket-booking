import React from 'react'
import { Navigate,Route } from 'react-router-dom';


const AdminProtect = ({ children }) => {

    const userType = localStorage.getItem('userType');
    

    if (userType === 'super_admin') {
      return children;
    }
  
    if (userType === 'normal_user') {
      return <Navigate to="/" />;
    }
  
    if (userType === 'bus_owner') {
      return <Navigate to="/busowner-dashboard" />;
    }
  

    return <Navigate to="/admin-login" />;
}

export default AdminProtect
