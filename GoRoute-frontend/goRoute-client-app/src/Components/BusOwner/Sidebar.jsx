import { Home, Calendar, Settings, HelpCircle, LogOut, Bus, PlusCircle, MapPin } from 'lucide-react';
import { useDispatch } from "react-redux";
import { clearUserData } from "../../slice/userSlicer";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../axios/axios';

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Initially set the sidebar to be hidden on mobile

    const handleLogout = () => {

        // axiosInstance.post('logout/')
        // .then(response => {
        //     console.log(response.data.message); 
        //     dispatch(clearUserData());
        //     localStorage.removeItem("accessToken");
        //     localStorage.removeItem("refreshToken");
        //     localStorage.removeItem("userType");
        //     navigate("/");  
        // })
        // .catch(error => {
        //     console.error("Logout error", error);
        // });





        dispatch(clearUserData());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userType");
        navigate("/");
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Mobile Sidebar Toggle Button */}
            <button onClick={toggleSidebar} className={`md:hidden text-white absolute top-4 left-4 z-10 ${isSidebarOpen ? 'hidden' : 'block'}`}>
                <span className="text-2xl">☰</span>
            </button>

            {/* Sidebar */}
            <div className={`flex flex-col w-64 bg-red-700 text-white ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
                <div className="flex items-center justify-between h-20 shadow-md px-4">
                    <div className="flex items-center">
                        <Bus className="h-8 w-8 text-white mr-2" />
                        <h1 className="text-3xl font-bold">GoRoute</h1>
                    </div>
                    {/* Hide Button when Sidebar is Open */}
                    <button onClick={toggleSidebar} className="md:hidden text-white">
                        <span className="text-2xl">×</span>
                    </button>
                </div>

                <ul className="flex flex-col py-4">
                    <li onClick={() => navigate('/busowner-dashboard/busowner-dashboard2')}>
                        <a className="flex items-center px-6 py-3 hover:bg-red-800">
                            <Home className="h-5 w-5" />
                            <span className="mx-3">Dashboard</span>
                        </a>
                    </li>
                    {/* <li onClick={() => navigate('bus-owner/route-table')}>
                        <a  className="flex items-center px-6 py-3 hover:bg-red-800">
                            <Calendar className="h-5 w-5" />
                            <span className="mx-3">Route</span>
                        </a>
                    </li> */}

                    <li onClick={() => navigate('bus-owner/route-table')}>
                        <a className="flex items-center px-6 py-3 hover:bg-red-800">
                            <MapPin className="h-5 w-5" /> {/* Updated to MapPin for 'Route' */}
                            <span className="mx-3">Route</span>
                        </a>
                    </li>
                    {/* <li onClick={() => navigate('bus-owner/add-bus-type/')}>
                        <a className="flex items-center px-6 py-3 hover:bg-red-800">
                            <Settings className="h-5 w-5" />
                            <span className="mx-3">Add bus</span>
                        </a>
                    </li> */}
                    <li onClick={() => navigate('bus-owner/add-bus-type/')}>
                        <a className="flex items-center px-6 py-3 hover:bg-red-800">
                            <PlusCircle className="h-5 w-5" /> {/* Replaced Bus icon with PlusCircle */}
                            <span className="mx-3">Add Bus Type</span>
                        </a>
                    </li>

                    {/* <li onClick={() => navigate('bus-owner/bus-list/')}>
                        <a className="flex items-center px-6 py-3 hover:bg-red-800">
                            <HelpCircle className="h-5 w-5" />
                            <span className="mx-3">Bus List</span>
                        </a>
                    </li> */}
                    <li onClick={() => navigate('bus-owner/bus-list/')}>
                        <a className="flex items-center px-6 py-3 hover:bg-red-800">
                            <Bus className="h-5 w-5" /> {/* Replaced HelpCircle with Bus icon */}
                            <span className="mx-3">Bus List</span>
                        </a>
                    </li>
                    <li>
                        <a className="flex items-center px-6 py-3 hover:bg-red-800">
                            <HelpCircle className="h-5 w-5" />
                            <span className="mx-3">Sample</span>
                        </a>
                    </li>
                </ul>

                {/* Logout */}
                <div className="mt-auto mb-4" onClick={handleLogout}>
                    <a className="flex items-center px-6 py-3 hover:bg-red-800">
                        <LogOut className="h-5 w-5" />
                        <span className="mx-3">Logout</span>
                    </a>
                </div>
            </div>

            {/* Mobile Overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
        </>
    );
}
