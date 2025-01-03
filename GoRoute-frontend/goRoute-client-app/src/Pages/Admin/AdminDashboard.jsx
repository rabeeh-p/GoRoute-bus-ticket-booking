import React from "react";
import { Route, Routes } from "react-router-dom";  
import { useDispatch } from "react-redux";
import { clearUserData } from "../../slice/userSlicer";  
import { useNavigate } from "react-router-dom";  
import UsersList from "./UsersList";  
import Dashboard from "./Dashboard";
import UserDetails from "./UserDetails";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUserData());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/admin-login");
    
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">GoRoute</span>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="bg-white text-red-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-r from-red-600 to-red-800 text-white">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <ul className="space-y-4">
              <li>
                <a
                onClick={() => {navigate('/admin-home/dashboard')}}
                  className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate('/admin-home/users-list')} 
                  className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                >
                  Users List
                </a>
              </li>
             
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Welcome to the Admin Panel</h1>
            <p className="text-lg">
              Use the sidebar to navigate through the different sections of the admin panel.
            </p>

            <Routes>
              <Route path="users-list" element={<UsersList />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="user-details/:id" element={<UserDetails />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
