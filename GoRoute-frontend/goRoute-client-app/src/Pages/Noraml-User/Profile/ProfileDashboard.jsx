import React from 'react'
import Sidebar from '../../../Components/Normal/UserProfile/Sidebar'
import UserDashboard from './UserDashboard'
import { Route, Routes } from 'react-router-dom'
import ProfileDetails from './ProfileDetails'

const ProfileDashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            

            <div className="flex-1 lg:ml-64">
                <Routes>
                    <Route path="user-dashboard/" element={<UserDashboard />} />
                    <Route path="profile" element={<ProfileDetails />} />
                </Routes>
            </div>
        </div>
    )
}

export default ProfileDashboard
