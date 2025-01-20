import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ConductorProtect = ({ children }) => {
  const userType = localStorage.getItem("userType") || useSelector((state) => state.user.userType);

  if (userType === "conductor") {
    return children;  
  }

  if (userType === "bus_owner") {
    return <Navigate to="/busowner-dashboard" replace />;
  }

  if (userType === "super_admin") {
    return <Navigate to="/admin-home" replace />;
  }

  return <Navigate to="/login" replace />;  
};

export default ConductorProtect;
