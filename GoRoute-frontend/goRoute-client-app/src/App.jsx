import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import ProfileDetails from './Pages/Noraml-User/Profile/ProfileDetails';
import AdminProtect from './Protect/AdminProtect';
import NormalUserProtect from './Protect/NormalUserProtect';
import HomeProtect from './Protect/HomeProtect';
import BusOwnerProtect from './Protect/BusOwnerProtect';
import LoggedInProtect from './Protect/LoggedInProtect';
function App() {


  return (
    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<LoggedInProtect> <UserLogin /> </LoggedInProtect>} />
        <Route path="/signUp" element={<LoggedInProtect> <SignUp />    </LoggedInProtect> } />
        <Route path="/otp" element={ <LoggedInProtect> <OTPVerification />     </LoggedInProtect>} />
        <Route path="/b-signup" element={<LoggedInProtect>  <BSignUp />   </LoggedInProtect>  } />

        {/* USER PROFILE SECTION */}
        <Route path="/" element={<HomeProtect> <Home /></HomeProtect>} />
        <Route path="/profile-dashboard/" element={<NormalUserProtect ><ProfileDashboard /></NormalUserProtect>}>
          <Route index element={<Navigate to="user-dashboard" />} />
          <Route path="user-dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<ProfileDetails />} />
        </Route>



        <Route path="/trip-booking" element={<TripBooking />} />


        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-home" element={<AdminProtect><AdminDashboard /></AdminProtect>}>
          <Route path="users-list" element={<UsersList />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user-details/:id" element={<UserDetails />} />
          <Route path="busowners-list" element={<BusOwnersList />} />
          <Route path="request-busowner" element={<RequestBusOwner />} />
          <Route path="busowner-details/:id" element={<BusOwnerDetails />} />


        </Route>

        <Route path="/users-list" element={<UsersList />} />



        <Route path="/busowner-dashboard" element={<BusOwnerProtect> <BusOwnerDashboard /> </BusOwnerProtect>} >
          <Route path="busowner-dashboard2" element={<BDashboard />} />
          <Route path="owner-profile" element={<OwnerProfile />} />
        </Route>
      </Routes>



    </BrowserRouter>
  );
}

export default App;