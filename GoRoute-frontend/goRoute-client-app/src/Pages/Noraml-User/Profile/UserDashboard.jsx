import React, { useEffect, useState } from 'react';
import { FaTicketAlt, FaWallet, FaHistory } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [stats, setStats] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/admin-login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user-dashboard/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const data = response.data;
                console.log(data, 'dataaaaaa');

                setStats([
                    { icon: FaTicketAlt, title: 'Active Tickets', value: data.stats[0]?.value ?? 0 },
                    { icon: FaWallet, title: 'Wallet Balance', value: data.stats[1]?.value ?? '₹0.00' },
                    { icon: FaHistory, title: 'Total Trips', value: data.stats[2]?.value ?? 0 },
                ]);

                setRecentBookings(data.recentBookings || []);  
            } catch (error) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-6">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.length > 0 &&
                    stats.map((stat, index) => (
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
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-red-600 mb-4">Recent Bookings</h2>
                {recentBookings.length > 0 ? (
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
                                        <td className="py-3 px-4">{booking.from ?? 'N/A'}</td>
                                        <td className="py-3 px-4">{booking.to ?? 'N/A'}</td>
                                        <td className="py-3 px-4">{booking.date ?? 'N/A'}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm ${
                                                    booking.status === 'Confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {booking.status ?? 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No recent bookings available.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
