import React from "react";
import { Route, Routes } from "react-router-dom";  
import { useDispatch, useSelector } from "react-redux";
import { clearUserData } from "../../slice/userSlicer";  
import { useNavigate } from "react-router-dom";  
import UsersList from "./UsersList";  
import Dashboard from "./Dashboard";
import UserDetails from "./UserDetails";
import BusOwnersList from "./BusOwnersList";
import RequestBusOwner from "./RequestBusOwner";
import BusOwnerDetails from "./BusOwnerDetails";
import AdminBusRequests from "./AdminBusRequests";
import BusDetails from "./BusDetails";
import BusSchedule from "../Bus_owners/BusSchedule";
import EditBusOwnerForm from "./BusOwner/EditBusOwnerForm";
import UserCreating from "./User/UserCreating";
import AdminWallet from "./AdminWallet";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  // const userType = useSelector((state) => state.user.user_type);
  // console.log(userType,'userrrr');
  
  

  const handleLogout = () => {
    dispatch(clearUserData());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem('userType');
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
              <li>
                <a
                  onClick={() => navigate('/admin-home/admin-wallet/')} 
                  className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                >
                  Wallet
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate('/admin-home/busowners-list')} 
                  className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                >
                  Bus owners list
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate('/admin-home/request-busowner')} 
                  className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                >
                  Requests 
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate('/admin-home/bus-requests/')} 
                  className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                >
                  Bus Requests 
                </a>
              </li>
             
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="text-gray-800">
            

            <Routes>
              <Route path="users-list" element={<UsersList />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="user-details/:id" element={<UserDetails />} />
              <Route path="busowners-list" element={<BusOwnersList />} />
              <Route path="request-busowner" element={<RequestBusOwner />} />
              <Route path="busowner-details/:id" element={<BusOwnerDetails />} />
              <Route path="bus-requests/" element={<AdminBusRequests />} />
              <Route path="bus-details/:busId" element={<BusDetails />} />
              <Route path="edit-bus-owner/:id" element={<EditBusOwnerForm />} />
              <Route path="user-creating" element={<UserCreating />} />
              <Route path="admin-wallet" element={<AdminWallet />} />

            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
