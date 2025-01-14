import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axios';
import { useNavigate, useParams } from 'react-router-dom';

const BusSchedule = () => {
  const { busId } = useParams();  
  const navigate = useNavigate();

  const [busDetails, setBusDetails] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStops, setSelectedStops] = useState([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    // Fetch bus details
    axiosInstance.get(`/buses/${busId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setBusDetails(response.data);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to fetch bus details');
      setLoading(false);
    });

    // Fetch routes
    axiosInstance.get('/routes/my_routes/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setRoutes(response.data);
      console.log(response,'data');
      
    })
    .catch(err => {
      setError('Failed to fetch routes');
    });
  }, [busId, navigate]);

  const handleRouteChange = (event) => {
    const routeId = event.target.value;
    const selected = routes.find(route => route.id === parseInt(routeId));
    setSelectedRoute(selected);
    setSelectedStops(selected ? selected.stops : []);
  };

  const handleSubmit = () => {
    if (!selectedRoute || !scheduledDate) {
      setError('Please fill all fields before submitting.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    const payload = {
      route_id: selectedRoute.id,
      scheduled_date: scheduledDate,
      status: status,
    };

    axiosInstance.post(`/schedule-bus/${busId}/`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      alert('Bus scheduled successfully!');
      navigate('/busowner-dashboard/scheduled-bus-list'); // Navigate to a success page or refresh
    })
    .catch(err => {
        console.log('error',err);
        
      setError('Failed to schedule bus. Please try again.');
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Bus Schedule</h1>
      </div>

      {loading && <div className="text-center text-lg text-gray-600">Loading...</div>}
      {error && <div className="text-center text-lg text-red-500">{error}</div>}

      {/* Current Bus Information */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        {busDetails && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Bus Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Bus Name</h3>
                <p className="text-gray-600">{busDetails.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Bus Type</h3>
                <p className="text-gray-600">{busDetails.bus_type_name}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Seat Count</h3>
                <p className="text-gray-600">{busDetails.seat_count_name}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Bus Number</h3>
                <p className="text-gray-600">{busDetails.bus_number}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Route and Scheduling Fields */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Route and Schedule</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose Route</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={handleRouteChange}
            value={selectedRoute ? selectedRoute.id : ''}
          >
            <option value="">-- Select Route --</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>{route.route_name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div> */}
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default BusSchedule;
