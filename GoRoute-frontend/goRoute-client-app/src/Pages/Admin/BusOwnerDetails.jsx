import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axios';  

const BusOwnerDetails = () => {
  const { id } = useParams();  
  const navigate = useNavigate();  
  const [busOwner, setBusOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setBusOwner(response.data);
        setLoading(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/admin-login');  
          setError('Session expired. Please log in again.');
        } else {
          setError('Error fetching bus owner details.');
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

  if (!busOwner) {
    return <div>No bus owner details found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-semibold text-red-600 text-center mb-6">Bus Owner Details</h2>
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 p-4">
          <h4 className="text-xl font-semibold text-gray-800">Travel Name: {busOwner.travel_name}</h4>
          <p className="text-gray-600 text-lg">Address: {busOwner.address}</p>
          <p className="text-gray-600 text-lg">Contact Number: {busOwner.contact_number}</p>
          <p className="text-gray-600 text-lg">Created Date: {new Date(busOwner.created_date).toLocaleString()}</p>
        </div>
        <div className="md:w-1/3 p-4 flex justify-center">
          <img
            src={busOwner.logo_image ? `http://127.0.0.1:8000${busOwner.logo_image}` : '/default-profile.jpg'}
            alt="Bus Owner Logo"
            className="w-32 h-32 rounded-full border-4 border-red-600 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default BusOwnerDetails;
