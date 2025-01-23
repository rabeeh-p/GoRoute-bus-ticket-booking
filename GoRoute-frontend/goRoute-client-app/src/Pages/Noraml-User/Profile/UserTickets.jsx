import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axios/axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busStarted, setBustStarted] = useState(false);
    const { orderId } = useParams();
    const navigate = useNavigate();

    console.log(orderDetails, 'order details');


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
                console.log(response.data, 'order now ');
                setBustStarted(response.data.order.bus_started)

            })
            .catch((error) => {
                console.error('Error fetching order details:', error);
                setLoading(false);
            });
    }, [orderId, navigate]);






    const handleCancel = (ticketId) => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            Swal.fire('Error!', 'You need to be logged in to cancel a ticket.', 'error');
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to cancel this ticket?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance
                    .post(`cancel-ticket/${ticketId}/`, {}, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    })
                    .then((response) => {
                        const { data } = response;
                        if (data.success) {
                            Swal.fire(
                                'Cancelled!',
                                `Your ticket has been cancelled. Refund of $${data.refund_amount} issued.`,
                                'success'
                            );
                            setTimeout(() => {
                                window.location.reload();
                            }, 5000);
                        } else {
                            Swal.fire('Error!', data.message, 'error');
                        }
                    })
                    .catch((error) => {
                        const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
                        Swal.fire('Error!', errorMessage, 'error');
                    });
            }
        });
    };



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
                                        <span className="font-medium text-gray-700">Bus Number:</span>
                                        <p className="text-gray-600">{orderDetails.bus_number}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Travels Name:</span>
                                        <p className="text-gray-600">{orderDetails.bus_owner_name}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Date:</span>
                                        <p className="text-gray-600">
                                            {new Date(orderDetails.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Total Amount:</span>
                                        <p className="text-gray-600">Rs{orderDetails.total_amount}</p>
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




                                </div>
                                <div className="text-center py-4">
                                    <button
                                        className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-800 transition-all duration-300 transform"
                                        onClick={() => navigate(`/profile-dashboard/bus-tracking/${orderDetails.bus_id}`)}
                                    >
                                        Watch Live Tracking
                                    </button>
                                </div>
                            </div>
                        )}


                        {tickets.length > 0 ? (
                            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                                <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Your Tickets</h2>
                                <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                    <thead>
                                        <tr className="bg-red-200 text-gray-700">
                                            <th className="px-6 py-3 text-left text-lg font-medium">Seat Number</th>
                                            <th className="px-6 py-3 text-left text-lg font-medium">Amount</th>
                                            <th className="px-6 py-3 text-left text-lg font-medium">Status</th>
                                            <th className="px-6 py-3 text-left text-lg font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((ticket) => (
                                            <tr
                                                key={ticket.id}
                                                className="hover:bg-red-50 transition duration-300 ease-in-out"
                                            >
                                                <td className="border px-6 py-4 text-gray-800 text-base">
                                                    {ticket.seat.seat_number}
                                                </td>
                                                <td className="border px-6 py-4 text-gray-800 text-base">
                                                    Rs{ticket.amount}
                                                </td>
                                                <td
                                                    className={`border px-6 py-4 text-base ${ticket.status === 'confirmed'
                                                        ? 'text-green-600 font-semibold'
                                                        : 'text-red-600 font-semibold'
                                                        }`}
                                                >
                                                    {ticket.status}
                                                </td>

                                                <td className="border px-6 py-4">
                                                    {busStarted ? (
                                                        <span className="text-gray-500">Bus has started, cancellation not allowed</span>
                                                    ) : (
                                                        ticket.status === 'confirmed' && (
                                                            <button
                                                                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                                                                onClick={() => handleCancel(ticket.id)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        )
                                                    )}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 p-6">
                                <h2 className="text-2xl font-semibold mb-4">No tickets found</h2>
                                <p className="text-lg">You don't have any tickets for this order. Try booking now!</p>
                            </div>
                        )}

                    </>
                )}
            </div>
        </div>
    );
};

export default UserTickets;
