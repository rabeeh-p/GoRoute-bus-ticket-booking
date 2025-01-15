import React, { useState, useEffect } from 'react';
import axiosInstance from './../../axios/axios';   
import { useNavigate, useParams } from 'react-router-dom';  
import Swal from 'sweetalert2';  
import useLogout from '../../Hook/useLogout';

const BusOwnerEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();  
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logoImageFile, setLogoImageFile] = useState(null);
    const [documentFile, setDocumentFile] = useState(null);  // New state for document
    const [travelName, setTravelName] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const { handleLogout } = useLogout();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            navigate('/admin-login');
            return;
        }

        axiosInstance.get(`bus-owner-details/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(response => {
            setOwner(response.data);
            setTravelName(response.data.travel_name || '');
            setAddress(response.data.address || '');
            setContactNumber(response.data.contact_number || '');
            setLoading(false);
        })
        .catch(err => {
            if (err.response && err.response.status === 401) {
                // localStorage.removeItem('accessToken');
                // localStorage.removeItem('refreshToken');
                // localStorage.removeItem('userType');
                // navigate('/login');
                handleLogout()
                setError('Session expired. Please log in again.');
            } else {
                setError('Failed to fetch owner data');
            }
            setLoading(false);
        });
    }, [id, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setLogoImageFile(file);
    };

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        setDocumentFile(file);  // Handle document file change
    };

    const validateForm = () => {
        const nameRegex = /^[a-zA-Z\s-]+$/;
        if (!nameRegex.test(travelName)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Travel Name',
                text: 'Travel Name should only contain letters, spaces, and dashes.',
            });
            return false;
        }

        if (address.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Address',
                text: 'Address cannot be empty.',
            });
            return false;
        }

        const contactNumberRegex = /^[0-9]{10}$/;
        if (!contactNumberRegex.test(contactNumber)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Contact Number',
                text: 'Contact Number should contain exactly 10 digits.',
            });
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/admin-login');
            return;
        }

        if (!validateForm()) {
            return;  
        }

        const formData = new FormData();
        formData.append('travel_name', travelName);
        formData.append('address', address);
        formData.append('contact_number', contactNumber);
        if (logoImageFile) {
            formData.append('logo_image', logoImageFile);
        }
        if (documentFile) {  // Add document file to FormData
            formData.append('document', documentFile);
        }

        axiosInstance.patch(`bus-owner-details/${id}/edit/`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data', 
            },
        })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Updated Successfully!',
                text: 'The bus owner details have been updated.',
            });
            navigate(`/busowner-dashboard/owner-profile`);
        })
        .catch(err => {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to update bus owner.',
            });
            setError('Failed to update bus owner');
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Bus Owner Details</h2>

            <form onSubmit={handleSubmit}>
                <div className="flex items-center space-x-6 mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-red-600">
                        {owner?.logo_image ? (
                            <a href={`http://127.0.0.1:8000${owner.logo_image}`} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={`http://127.0.0.1:8000${owner.logo_image}`}
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                />
                            </a>
                        ) : (
                            <div className="w-full h-full bg-gray-300"></div>
                        )}
                    </div>

                    <div className="flex-1">
                        <input 
                            type="file" 
                            onChange={handleImageChange} 
                            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Travel Name</label>
                    <input 
                        type="text" 
                        value={travelName} 
                        onChange={(e) => setTravelName(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Contact Number</label>
                    <input 
                        type="text" 
                        value={contactNumber} 
                        onChange={(e) => setContactNumber(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Document Upload Field */}
                <div className="mb-4">
                    <label className="block text-gray-700">Upload Document</label>
                    <input 
                        type="file" 
                        onChange={handleDocumentChange} 
                        className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default BusOwnerEdit;
