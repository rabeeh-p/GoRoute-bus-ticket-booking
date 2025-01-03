import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';   
import axiosInstance from '../../axios/axios';

const UserDetails = () => {
    const { id } = useParams();   
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    console.log(user, 'userrrrrrrr single');


    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            navigate('/admin-login');
            return;
        }

        axiosInstance.get(`/profile/${id}/`, {  
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate('/admin-login');
                    setError('Session expired. Please log in again.');
                } else {
                    setError('Error fetching user details.');
                }
                setLoading(false);
            });
    }, [id, navigate]);   

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>No user data available</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-semibold text-red-600">User Details</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 p-4">
                    <h4 className="text-xl font-semibold text-gray-800">Name: {user.first_name} {user.last_name}</h4>
                    <p className="text-gray-600 text-lg">Phone: {user.phone_number}</p>
                    <p className="text-gray-600 text-lg">Date of Birth: {user.date_of_birth}</p>
                    <p className="text-gray-600 text-lg">Gender: {user.gender}</p>
                </div>
                <div className="md:w-1/3 p-4 flex justify-center">
                    <img
                        src={user.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : '/default-profile.jpg'}  
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-red-600 object-cover"  
                    />
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
