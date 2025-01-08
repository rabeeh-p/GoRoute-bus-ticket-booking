import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const LoggedInProtect = ({ children }) => {
  const token =
    localStorage.getItem("accessToken") || useSelector((state) => state.user.token);
  const userType =
    localStorage.getItem("userType") || useSelector((state) => state.user.userType);

    
    

  if (token) {
    if (userType === "normal_user") {
      return <Navigate to="/" />;
    }
    if (userType === "bus_owner") {
      return <Navigate to="/busowner-dashboard" />;
    }
    if (userType === "super_admin") {
      return <Navigate to="/admin-home/dashboard" />;
    }
  }

  return children;
};

export default LoggedInProtect;
