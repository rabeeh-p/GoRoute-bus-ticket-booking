import React, { useEffect, useState } from 'react';
import axiosInstance from './../../axios/axios';   
import { useNavigate } from 'react-router-dom';
 import useLogout from '../../Hook/useLogout';  
 import Swal from 'sweetalert2';

const OwnerProfile = () => {
    const navigate = useNavigate();
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { handleLogout } = useLogout();

    console.log(owner, 'owner');


    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            navigate('/login');
            return;
        }

        axiosInstance.get('bus-owner-detail/', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                const ownerData = response.data;
                
                // if (!ownerData.is_approved) {
                //     handleLogout();
                //     setError('Your account is not approved. Please contact support.');
                //     return;
                // }

                if (!ownerData.is_approved) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Account Is Blocked Approved',
                        text: ' Please contact support.',
                    }).then(() => {
                        handleLogout();
                    });
                    return;
                }

                setOwner(response.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                     
                    handleLogout()
                    setError('Session expired. Please log in again.');
                } else {
                    setError('Failed to fetch owner data');
                }
                setLoading(false);
            });
    }, [navigate]);  

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg mt-10">
            <div className="flex items-center space-x-6">
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
                    <h1 className="text-2xl font-bold text-gray-800">{owner?.travel_name || 'Bus Owner Name'}</h1>
                    <p className="text-gray-600">{owner?.address || 'Address: City, Country'}</p>
                    <p className="text-gray-600">{owner?.contact_number || 'Contact: +1234567890'}</p>
                    <p className="text-gray-500 text-sm">
                        Member since: {owner?.created_date ? new Date(owner.created_date).toLocaleDateString() : '01/01/2022'}
                    </p>
                    <p className="text-sm mt-2 text-green-600">
                        {owner?.is_approved ? 'Approved' : 'Pending Approval'}
                    </p>
                </div>

                <button
                onClick={()=>navigate(`/busowner-dashboard/edit-owner-profile/${owner.user}`)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none">
                    Edit
                </button>
            </div>
            {owner?.document && (
        <div className="mt-4">
            <a
                href={`http://127.0.0.1:8000${owner.document}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none">
                View Document
            </a>
        </div>
    )}
        </div>
    );
};

export default OwnerProfile;
