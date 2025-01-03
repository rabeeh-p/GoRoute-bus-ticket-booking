import React from 'react'
import Sidebar from '../../Components/BusOwner/SideBar'
import Header from '../../Components/BusOwner/Header'
import { Route, Routes } from 'react-router-dom'
import BDashboard from './BDashboard'
import OwnerProfile from './OwnerProfile'

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
                        
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default BusOwnerDashboard
