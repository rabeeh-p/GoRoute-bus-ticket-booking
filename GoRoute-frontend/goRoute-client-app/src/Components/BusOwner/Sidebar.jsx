import { Home, Calendar, Settings, HelpCircle, LogOut, Bus } from 'lucide-react'
import { useDispatch } from "react-redux";
import { clearUserData } from "../../slice/userSlicer";
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(clearUserData());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userType");
        navigate("/");

    };
    return (
        <div className="flex flex-col w-64 bg-red-700 text-white">
            <div className="flex items-center justify-center h-20 shadow-md">
                <Bus className="h-8 w-8 text-white mr-2" />
                <h1 className="text-3xl font-bold">GoRoute</h1>
            </div>
            <ul className="flex flex-col py-4">
                <li onClick={() => navigate('/busowner-dashboard/busowner-dashboard2')}>
                    <a className="flex items-center px-6 py-3 hover:bg-red-800">
                        <Home className="h-5 w-5" />
                        <span className="mx-3">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center px-6 py-3 hover:bg-red-800">
                        <Calendar className="h-5 w-5" />
                        <span className="mx-3">Schedule</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center px-6 py-3 hover:bg-red-800">
                        <Settings className="h-5 w-5" />
                        <span className="mx-3">Settings</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center px-6 py-3 hover:bg-red-800">
                        <HelpCircle className="h-5 w-5" />
                        <span className="mx-3">Help</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center px-6 py-3 hover:bg-red-800">
                        <HelpCircle className="h-5 w-5" />
                        <span className="mx-3">Sample</span>
                    </a>
                </li>
            </ul>
            <div className="mt-auto mb-4" onClick={handleLogout}>
                <a className="flex items-center px-6 py-3 hover:bg-red-800" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span className="mx-3">Logout</span>
                </a>
            </div>
        </div>
    )
}

