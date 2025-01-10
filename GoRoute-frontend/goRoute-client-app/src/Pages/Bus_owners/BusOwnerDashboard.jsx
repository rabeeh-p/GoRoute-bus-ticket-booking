import React from 'react'
import Sidebar from '../../Components/BusOwner/SideBar'
import Header from '../../Components/BusOwner/Header'
import { Route, Routes } from 'react-router-dom'
import BDashboard from './BDashboard'
import OwnerProfile from './OwnerProfile'
import RouteTable from './RouteTable'
import AddRouteForm from './AddRouteForm'
import RouteStopsManager from './RouteStopManager'
import AddBusType from './AddBusType'
import BusList from './BusList'
import AddBus from './AddBus'
import BusSchedule from './BusSchedule'

const BusOwnerDashboard = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <Routes>
                        <Route path="busowner-dashboard2" element={<BDashboard />} />
                        <Route path="owner-profile" element={<OwnerProfile />} />
                        <Route path="bus-owner/route-table" element={<RouteTable />} />
                        <Route path="bus-owner/add-route" element={<AddRouteForm />} />
                        <Route path="bus-owner/add-stop/:routeId" element={<RouteStopsManager />} />
                        <Route path="bus-owner/add-bus-type/" element={<AddBusType />} />
                        <Route path="bus-owner/bus-list/" element={<BusList />} />
                        <Route path="bus-owner/bus-add" element={<AddBus />} />
                        <Route path="bus-schedule/:busId" element={<BusSchedule />} />
                        
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default BusOwnerDashboard
