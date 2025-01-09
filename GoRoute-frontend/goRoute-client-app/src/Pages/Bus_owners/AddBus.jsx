import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axios';  
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  

const AddBus = () => {
    const [busNumber, setBusNumber] = useState('');
    const [busType, setBusType] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [busDocument, setBusDocument] = useState(null);  
    const [loading, setLoading] = useState(false);
    const [busTypes, setBusTypes] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get('add_bus_type/')
            .then((response) => {
                setBusTypes(response.data);
            })
            .catch((error) => {
                setError('Failed to fetch bus types');
                console.error('Error fetching bus types:', error);
            });
    }, []);

    const handleAddBus = async (e) => {
        e.preventDefault();
        setLoading(true);


        if (!busDocument) {
            setError('Please upload the bus document.');
            Swal.fire({
                icon: 'error',
                title: 'Validation Error!',
                text: 'Please upload the bus document.',
                confirmButtonText: 'OK',
            });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('bus_number', busNumber);
        formData.append('bus_type', busType);
        formData.append('description', description);
        formData.append('name', name);
        if (busDocument) {
            formData.append('bus_document', busDocument);  
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setError('No access token found');
                return;
            }

            const response = await axiosInstance.post(
                'add-bus/', 
                formData, 
                { 
                    headers: { 
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data' 
                    }
                }
            );
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Bus added successfully!',
                confirmButtonText: 'OK'
            });
            navigate('/busowner-dashboard/bus-owner/bus-list/');  
        } catch (error) {
            console.error('There was an error adding the bus!', error);

            if (error.response && error.response.data) {
                if (error.response.data.name && error.response.data.name.length > 0) {
                    setError(error.response.data.name[0]);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error.response.data.name[0],
                        confirmButtonText: 'OK'
                    });
                } else if (error.response.data.bus_number) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.response.data.bus_number[0],  
                    });
                } else {
                    setError('Failed to add bus.');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to add bus.',
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                setError('An unknown error occurred.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'An unknown error occurred.',
                    confirmButtonText: 'OK'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Add Bus</h2>
            </div>
            <form onSubmit={handleAddBus} className="bg-white shadow-md rounded-lg p-6">
                {error && <p className="text-red-500">{error}</p>}  
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Bus Number</label>
                        <input
                            type="text"
                            value={busNumber}
                            onChange={(e) => setBusNumber(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Bus Type</label>
                        <select
                            value={busType}
                            onChange={(e) => setBusType(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        >
                            <option value="">Select Bus Type</option>
                            {busTypes.length > 0 ? (
                                busTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name} - {type.seat_type}- {type.seat_count}
                                    </option>
                                ))
                            ) : (
                                <option value="">Loading bus types...</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Bus Document</label>
                        <input
                            type="file"
                            onChange={(e) => setBusDocument(e.target.files[0])}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Bus'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBus;
