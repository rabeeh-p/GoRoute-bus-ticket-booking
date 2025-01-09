import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axios';  
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const BusDetails = () => {
    const [busDetails, setBusDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { busId } = useParams();  
    console.log(busId,'bus idddd');
    console.log(busDetails,'bus details');


    

    useEffect(() => {
        fetchBusDetails();
    }, [busId]);

    const fetchBusDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`buses/${busId}/`);
            setBusDetails(response.data);
        } catch (err) {
            setError('Failed to fetch bus details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDocument = () => {
        if (busDetails?.bus_document) {
            window.open(`http://127.0.0.1:8000/${busDetails.bus_document}`, '_blank');
        } else {
            Swal.fire('No Document', 'There is no document available for this bus.', 'info');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-3xl font-semibold text-gray-800">Bus Details</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-medium text-gray-700">Bus Number:</h3>
                        <p className="text-lg text-gray-600">{busDetails.bus_number}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-gray-700">Owner Name:</h3>
                        <p className="text-lg text-gray-600">{busDetails.bus_owner_name}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-gray-700">Bus Type:</h3>
                        <p className="text-lg text-gray-600">{busDetails.bus_type_name}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-gray-700">Status:</h3>
                        <p
                            className={`text-lg ${
                                busDetails.is_active ? 'text-green-600' : 'text-yellow-600'
                            }`}
                        >
                            {busDetails.is_active ? 'Active' : 'Pending'}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleViewDocument}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        View Document
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusDetails;
