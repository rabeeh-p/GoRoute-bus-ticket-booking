import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminBusRequests = () => {
    const [busRequests, setBusRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchBusRequests();
    }, []);

    const fetchBusRequests = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/admin-login');
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance.get('buses/pending/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setBusRequests(response.data);
        } catch (err) {
            setError('Failed to fetch bus requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    

    const handleApprove = async (id) => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            navigate('/admin-login');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to approve this bus request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.post(`/bus-requests/${id}/approve/`, {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                Swal.fire('Approved!', 'Bus request approved successfully.', 'success');
                fetchBusRequests();
            } catch (error) {
                Swal.fire('Error!', 'Failed to approve the request.', 'error');
                console.error(error);
            }
        }
    };

    const handleReject = async (id) => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            navigate('/admin-login');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to reject this bus request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, reject it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.post(`/bus-requests/${id}/reject/`, {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                Swal.fire('Rejected!', 'Bus request rejected successfully.', 'success');
                fetchBusRequests();
            } catch (error) {
                Swal.fire('Error!', 'Failed to reject the request.', 'error');
                console.error(error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bus Requests</h2>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : busRequests.length === 0 ? (
                <p className="text-gray-500">No bus requests available.</p>  
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                        <thead className="bg-red-500 text-white">
                            <tr>
                                <th className="px-4 py-2 text-left">Bus Number</th>
                                <th className="px-4 py-2 text-left">Owner</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {busRequests.map((request) => (
                                <tr key={request.id} className="border-t">
                                    <td className="px-4 py-2">{request.bus_number}</td>
                                    <td className="px-4 py-2">{request.bus_owner_name}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleApprove(request.id)}
                                            className="px-4 py-1 bg-green-500 text-white rounded-lg mr-2 hover:bg-green-600"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(request.id)}
                                            className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin-home/bus-details/${request.id}`)}
                                            className="px-4 py-1 bg-blue-500 text-white rounded-lg ml-2 hover:bg-blue-600"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminBusRequests;
