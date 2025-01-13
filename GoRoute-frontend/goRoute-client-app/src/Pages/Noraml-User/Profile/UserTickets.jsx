import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axios/axios';
import { useNavigate, useParams } from 'react-router-dom';

const UserTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }

        axiosInstance
            .get(`orders/${orderId}/tickets/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setOrderDetails(response.data.order);
                setTickets(response.data.tickets);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching order details:', error);
                setLoading(false);
            });
    }, [orderId, navigate]);

    return (
        <div className="bg-red-50 p-6 sm:p-8 md:p-10 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <h1 className="text-center text-4xl font-bold text-red-600 py-6">
                    Order & Ticket Details
                </h1>

                {loading ? (
                    <div className="text-center text-gray-500">Loading details...</div>
                ) : (
                    <>
                        {orderDetails && (
                            <div className="p-6 bg-red-100 border-b border-gray-300 rounded-t-xl">
                                <h2 className="text-2xl font-semibold text-red-600 mb-4">
                                    Order Details
                                </h2>
                                <div className="grid grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Order ID:</span>
                                        <p className="text-gray-600">{orderDetails.id}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Date:</span>
                                        <p className="text-gray-600">
                                            {new Date(orderDetails.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Total Amount:</span>
                                        <p className="text-gray-600">${orderDetails.total_amount}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Status:</span>
                                        <p className="text-gray-600">{orderDetails.status}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">From:</span>
                                        <p className="text-gray-600">{orderDetails.from_city}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">To:</span>
                                        <p className="text-gray-600">{orderDetails.to_city}</p>
                                    </div>
                                    {/* <div>
                                        <span className="font-medium text-gray-700">date</span>
                                        <p>{new Date(orderDetails.date).toLocaleDateString()}</p>
                                    </div> */}
                                </div>
                            </div>
                        )}

                        {tickets.length > 0 ? (
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold text-red-600 mb-4">Tickets</h2>
                                <table className="min-w-full bg-white border border-gray-300 rounded-xl">
                                    <thead>
                                        <tr className="bg-red-100 text-gray-700">
                                            <th className="px-6 py-3 text-left">Seat Number</th>
                                            <th className="px-6 py-3 text-left">Boarding Time</th>
                                            <th className="px-6 py-3 text-left">Amount</th>
                                            <th className="px-6 py-3 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-red-50">
                                                <td className="border px-6 py-4">{ticket.seat.seat_number}</td>
                                                <td className="border px-6 py-4">{ticket.boarding_time}</td>
                                                <td className="border px-6 py-4">${ticket.amount}</td>
                                                <td
                                                    className={`border px-6 py-4 ${
                                                        ticket.status === 'Confirmed'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {ticket.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 p-6">
                                No tickets found for this order.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserTickets;
