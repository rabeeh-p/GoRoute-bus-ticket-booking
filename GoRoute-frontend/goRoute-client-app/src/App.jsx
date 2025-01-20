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
import RouteTable from './Pages/Bus_owners/RouteTable';
import AddRouteForm from './Pages/Bus_owners/AddRouteForm';
import RouteStopsManager from './Pages/Bus_owners/RouteStopManager';
import AddBusType from './Pages/Bus_owners/AddBusType';
import BusList from './Pages/Bus_owners/BusList';
import AddBus from './Pages/Bus_owners/AddBus';
import AdminBusRequests from './Pages/Admin/AdminBusRequests';
import BusDetails from './Pages/Admin/BusDetails';
import BusSchedule from './Pages/Bus_owners/BusSchedule';
import ScheduledBusList from './Pages/Bus_owners/ScheduledBusList';
import ScheduledBusDetails from './Pages/Bus_owners/ScheduledBusDetails';
import UserBusView from './Pages/Noraml-User/UserBusView';
import UserTickets from './Pages/Noraml-User/Profile/UserTickets';
import UserOrders from './Pages/Noraml-User/Profile/UserOrders';
import EditRouteForm from './Pages/Bus_owners/Route/EditRouteForm';
import EditBusOwnerForm from './Pages/Admin/BusOwner/EditBusOwnerForm';
import UserCreating from './Pages/Admin/User/UserCreating';
import EditOwnerProfile from './Pages/Bus_owners/EditOwnerProfile';
import UserProfileEdit from './Pages/Noraml-User/Profile/UserProfileEdit';
import Wallet from './Pages/Noraml-User/Profile/Wallet';
import BusWallet from './Pages/Bus_owners/BusWallet';
import BusTracking from './Pages/Noraml-User/Profile/BusTracking';
import ConductorRegistrationForm from './Pages/Bus_owners/Conductor/ConductorRegistrationForm';
import ConductorsList from './Pages/Bus_owners/Conductor/ConductorsList';
import ConductorLogin from './Pages/Conductor/ConductorLogin';
import ConductorLandingPage from './Pages/Conductor/ConductorLandingPage';
import DashboardConductor from './Pages/Conductor/DashboardConductor';
import ConductorProtect from './Protect/ConductorProtect';
function App() {


  return (
    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<LoggedInProtect> <UserLogin /> </LoggedInProtect>} />
        <Route path="/signUp" element={<LoggedInProtect> <SignUp />    </LoggedInProtect> } />
        <Route path="/otp" element={ <LoggedInProtect> <OTPVerification />     </LoggedInProtect>} />
        <Route path="/b-signup" element={<LoggedInProtect>  <BSignUp />   </LoggedInProtect>  } />

        
        <Route path="/" element={<HomeProtect> <Home /></HomeProtect>} />

        {/* USER PROFILE SECTION */}
        <Route path="/profile-dashboard/" element={<NormalUserProtect ><ProfileDashboard /></NormalUserProtect>}>
          <Route index element={<Navigate to="user-dashboard" />} />
          <Route path="user-dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<ProfileDetails />} />
          <Route path="orders/:orderId/tickets" element={<UserTickets />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="profile-edit" element={<UserProfileEdit />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="bus-tracking" element={<BusTracking />} />
        </Route>



        <Route path="/trip-booking" element={<TripBooking />} />
        <Route path="/user-bus-view/:busId" element={<UserBusView />} />


        <Route path="/admin-login" element={<LoggedInProtect><AdminLogin /> </LoggedInProtect>} />

        <Route path="/admin-home" element={<AdminProtect><AdminDashboard /></AdminProtect>}>
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


        </Route>

        <Route path="/users-list" element={<UsersList />} />

        <Route path="/conductor-login" element={<ConductorLogin />    } />
        <Route path="/conductor-home" element={<ConductorProtect> <ConductorLandingPage /> </ConductorProtect>  } />
        <Route path="/conductor-dashboard" element={<ConductorProtect>   <DashboardConductor /> </ConductorProtect> } />



        <Route path="/busowner-dashboard" element={<BusOwnerProtect> <BusOwnerDashboard /> </BusOwnerProtect>} >
          <Route path="busowner-dashboard2" element={<BDashboard />} />
          <Route path="owner-profile" element={<OwnerProfile />} />
          <Route path="bus-owner/route-table" element={<RouteTable />} />
          <Route path="bus-owner/add-route/" element={<AddRouteForm />} />
          <Route path="bus-owner/add-stop/:routeId" element={<RouteStopsManager />} />
          <Route path="bus-owner/add-bus-type/" element={<AddBusType />} />
          <Route path="bus-owner/bus-list/" element={<BusList />} />
          <Route path="bus-owner/bus-add" element={<AddBus />} />
          <Route path="bus-schedule/:busId" element={<BusSchedule />} />
          <Route path="scheduled-bus-list" element={<ScheduledBusList />} />
          <Route path="scheduled-bus-details/:busId" element={<ScheduledBusDetails />} />
          <Route path="edit-route/:routeId" element={<EditRouteForm />} />
          <Route path="edit-owner-profile/:id" element={<EditOwnerProfile />} />
          <Route path="bus-wallet" element={<BusWallet />} />
          <Route path="conductor-registration" element={<ConductorRegistrationForm />} />
          <Route path="conductor-list" element={<ConductorsList />} />
        </Route>
      </Routes>



    </BrowserRouter>
  );
}

export default App;