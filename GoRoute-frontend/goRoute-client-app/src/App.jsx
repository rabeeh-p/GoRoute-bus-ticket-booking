import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Noraml-User/Home'
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import BusOwner_Home from './Pages/Bus_owners/BusOwner_Home';
import UserLogin from './Pages/Noraml-User/UserLogin';
import SignUp from './Pages/Noraml-User/SignUp';
import OTPVerification from './Pages/Noraml-User/OTPVerification';
function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/otp" element={<OTPVerification />} />



        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-home" element={<AdminDashboard />} />




        <Route path="/busowner-home" element={<BusOwner_Home />} />
      </Routes>



    </BrowserRouter>
  );
}

export default App;