import React from 'react'
import { FaTicketAlt, FaWallet, FaHistory } from 'react-icons/fa';

const UserDashboard = () => {
    const stats = [
        { icon: FaTicketAlt, title: 'Active Tickets', value: '2' },
        { icon: FaWallet, title: 'Wallet Balance', value: '₹500' },
        { icon: FaHistory, title: 'Total Trips', value: '15' },
    ];
  
    const recentBookings = [
        { from: 'Mumbai', to: 'Pune', date: '2024-03-15', status: 'Confirmed' },
        { from: 'Delhi', to: 'Agra', date: '2024-03-10', status: 'Completed' },
    ];
  
    return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-6">Dashboard</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <stat.icon className="text-red-600 text-3xl mr-4" />
                  <div>
                    <p className="text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
    
          {/* Recent Bookings */}
          {/* <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">From</th>
                    <th className="text-left py-3 px-4">To</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{booking.from}</td>
                      <td className="py-3 px-4">{booking.to}</td>
                      <td className="py-3 px-4">{booking.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          booking.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}
        </div>
    );
}

export default UserDashboard;
