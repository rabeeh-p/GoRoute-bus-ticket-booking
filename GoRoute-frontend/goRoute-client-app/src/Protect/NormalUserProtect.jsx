import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const NormalUserProtect = ({children}) => {
  const userType = localStorage.getItem("userType") || useSelector((state) => state.user.userType);

  if (userType === "normal_user") {
    return children;
  }

  if (userType === "bus_owner") {
    return <Navigate to="/busowner-dashboard" />;
  }

  if (userType === "super_admin") {
    return <Navigate to="/admin-home" />;
  }

  return <Navigate to="/login" />;
};

export default NormalUserProtect;
