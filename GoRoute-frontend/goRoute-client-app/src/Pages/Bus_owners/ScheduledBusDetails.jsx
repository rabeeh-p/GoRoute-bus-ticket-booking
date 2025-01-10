import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axios';   
import { useNavigate, useParams } from 'react-router-dom';

const ScheduledBusDetails = () => {
  const { busId } = useParams();
  console.log(busId,'bus id');
  
  const [busDetails, setBusDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    axiosInstance.get(`/scheduled-buses/${busId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setBusDetails(response.data);
      setLoading(false);
    })
    .catch(err => {
      console.log('err', err);
      setError('Failed to fetch bus details');
      setLoading(false);
    });
  }, [busId, navigate]);

  if (loading) {
    return <div className="text-center text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-red-600 text-white py-2 px-4 rounded-md mb-6 hover:bg-red-700 transition duration-300"
      >
        Back to List
      </button>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">{busDetails.bus_number} - {busDetails.bus_type}</h1>
          <p className="text-gray-600 text-lg">Owner: {busDetails.bus_owner_name}</p>
          <p className="text-gray-600 text-lg">Seat Type: {busDetails.seat_type}</p>
          <p className="text-gray-600 text-lg">Seats Available: {busDetails.seat_count}</p>
          <p className="text-gray-600 text-lg">Route: {busDetails.route}</p>
          <p className="text-gray-600 text-lg">Scheduled Date: {new Date(busDetails.scheduled_date).toLocaleString()}</p>
          <p className="text-gray-600 text-lg">Description: {busDetails.description || 'No description provided'}</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Route & Stops</h2>
          <div className="space-y-4">
            {busDetails.stops && busDetails.stops.length > 0 ? (
              busDetails.stops.map((stop, index) => (
                <div key={index} className="border-b border-gray-200 py-2">
                  <p className="font-semibold text-gray-800">Stop {index + 1}: {stop.stop_name}</p>
                  <p className="text-gray-600">Arrival Time: {stop.arrival_time}</p>
                  <p className="text-gray-600">Departure Time: {stop.departure_time}</p>
                  {stop.description && <p className="text-gray-600">Description: {stop.description}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No stops available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledBusDetails;
