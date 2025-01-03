import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axios';  
import { useNavigate } from 'react-router-dom';

const BusOwnersList = () => {
  const [busOwners, setBusOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log(busOwners,'busowners');
  console.log(busOwners.id,'busownersid');
  

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/admin-login');
      return;
    }

    axiosInstance.get('approved-bus-owners/', {   
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setBusOwners(response.data);
      setLoading(false);
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/admin-login');
      } else {
        setError('Failed to fetch bus owner data');
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

  const handleViewClick = (ownerId) => {
    navigate(`/admin-home/busowner-details/${ownerId}`);   
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-semibold text-center mb-6">Bus Owners List</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Profile</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Travel Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {busOwners.map(owner => (
            <tr key={owner.id} className="border-b">
              <td className="px-6 py-4">
                <img
                  src={`http://127.0.0.1:8000${owner.logo_image || '/default-logo.jpg'}`}
                  alt={owner.travel_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{owner.travel_name}</td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => handleViewClick(owner.user)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusOwnersList;
