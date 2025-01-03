import { Bell, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate()
    
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-red-600">
      <div className="flex items-center">
        <span className="text-xl font-semibold text-gray-800">BusOwner Dashboard</span>
      </div>
      <div className="flex items-center space-x-6">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-500" />
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-red-500"
            type="text"
            placeholder="Search"
          />
        </div>

        {/* Notification Button */}
        <button className="flex items-center text-gray-500 hover:text-red-600">
          <Bell className="h-5 w-5" />
          <span className="ml-2 text-sm font-medium">Notifications</span>
        </button>

        {/* Profile Button */}
        <div className="relative" >
          <button className="flex items-center text-gray-500 hover:text-red-600" onClick={()=>navigate('/busowner-dashboard/owner-profile')} >
            <User className="h-6 w-6" />
            <span className="ml-2 text-sm font-medium">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
}
