import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axios/axios';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }

        axiosInstance.get('orders/', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(response => {
            console.log('Order Data:', response.data);
            setOrders(response.data.orders);   
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            setLoading(false);
        });
    }, [navigate]);

    const viewTickets = (orderId) => {
        navigate(`/profile-dashboard/orders/${orderId}/tickets`);  
    };

    return (
        <div className="bg-gray-100 p-4 sm:p-6 md:p-8 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <h1 className="text-center text-3xl font-semibold text-red-600 p-4">My Booking</h1>
                
                {loading ? (
                    <div className="text-center text-gray-500">Loading orders...</div>
                ) : orders.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Bus Name</th>
                                <th className="px-4 py-2 text-left">Route</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td className="border px-4 py-2">{order.bus.bus_owner_name}</td>
                                    <td className="border px-4 py-2">{order.from_city} to {order.to_city}</td>
                                    <td className="border px-4 py-2">
                                        <button 
                                            onClick={() => viewTickets(order.id)} 
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                                        >
                                            View Tickets
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-500">You have no booking yet.</div>
                )}
            </div>
        </div>
    );
};

export default UserOrders;
