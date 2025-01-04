import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Noraml-User/Home'
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserLogin from './Pages/Noraml-User/UserLogin';
import SignUp from './Pages/Noraml-User/SignUp';
import OTPVerification from './Pages/Noraml-User/OTPVerification';
import TripBooking from './Pages/Noraml-User/TripBooking';
import UsersList from './Pages/Admin/UsersList';
import Dashboard from './Pages/Admin/Dashboard';
import UserDetails from './Pages/Admin/UserDetails';
import BusOwnersList from './Pages/Admin/BusOwnersList';
import RequestBusOwner from './Pages/Admin/RequestBusOwner';
import BusOwnerDetails from './Pages/Admin/BusOwnerDetails';
import BusOwnerDashboard from './Pages/Bus_owners/BusOwnerDashboard';
import BDashboard from './Pages/Bus_owners/BDashboard';
import OwnerProfile from './Pages/Bus_owners/OwnerProfile';
import BSignUp from './Pages/Bus_owners/BSignUp';
import ProfileDashboard from './Pages/Noraml-User/Profile/ProfileDashboard';
import UserDashboard from './Pages/Noraml-User/Profile/UserDashboard';
function App() {


  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/otp" element={<OTPVerification />} />

        {/* USER PROFILE SECTION */}

        <Route path="/profile-dashboard" element={<ProfileDashboard />} >

          <Route path="user-dashboard" element={<UserDashboard />} />
        </Route>



        <Route path="/trip-booking" element={<TripBooking />} />


        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-home" element={<AdminDashboard />} >
          <Route path="users-list" element={<UsersList />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user-details/:id" element={<UserDetails />} />
          <Route path="busowners-list" element={<BusOwnersList />} />
          <Route path="request-busowner" element={<RequestBusOwner />} />
          <Route path="busowner-details/:id" element={<BusOwnerDetails />} />


        </Route>

        <Route path="/users-list" element={<UsersList />} />


        <Route path="/b-signup" element={<BSignUp />} />

        <Route path="/busowner-dashboard" element={<BusOwnerDashboard />} >
          <Route path="busowner-dashboard2" element={<BDashboard />} />
          <Route path="owner-profile" element={<OwnerProfile />} />

        </Route>
      </Routes>



    </BrowserRouter>
  );
}

export default App;