import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Noraml-User/Home'
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import BusOwner_Home from './Pages/Bus_owners/BusOwner_Home';
import UserLogin from './Pages/Noraml-User/UserLogin';
import SignUp from './Pages/Noraml-User/SignUp';
import OTPVerification from './Pages/Noraml-User/OTPVerification';
import TripBooking from './Pages/Noraml-User/TripBooking';
import UsersList from './Pages/Admin/UsersList';
import Dashboard from './Pages/Admin/Dashboard';
function App() {
  
  
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/otp" element={<OTPVerification />} />

        <Route path="/trip-booking" element={<TripBooking />} />


        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-home" element={<AdminDashboard />} >
          <Route path="users-list" element={<UsersList />} />
          <Route path="dashboard" element={<Dashboard />} />

        </Route>
        <Route path="/users-list" element={<UsersList />} />




        <Route path="/busowner-home" element={<BusOwner_Home />} />
      </Routes>



    </BrowserRouter>
  );
}

export default App;