import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axios';
import { useNavigate, useParams } from 'react-router-dom';
import useLogout from '../../Hook/useLogout';
import Swal from 'sweetalert2';

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
  const { handleLogout } = useLogout();
  const [conductors, setConductors] = useState([]);
  const [selectedConductor, setSelectedConductor] = useState(null);  // State to store selected conductor

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
    axiosInstance.get('/routes/my_routes/schedule-time/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setRoutes(response.data);
    })
    .catch(err => {
      if (err.response && err.response.status === 401) {
        handleLogout();  
      } else {
        setError('Failed to fetch routes');
        setLoading(false);
      }
    });

    // Fetch conductors
    axiosInstance.get('/conductors/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      const inactiveConductors = response.data.filter(conductor => !conductor.is_active);
      setConductors(inactiveConductors);
      console.log(response.data,'conduc');
      
    })
    .catch(err => {
      setError('Failed to fetch conductors');
      setLoading(false);
    });
  }, [busId, navigate]);

  const handleRouteChange = (event) => {
    const routeId = event.target.value;
    const selected = routes.find(route => route.id === parseInt(routeId));
    setSelectedRoute(selected);
    setSelectedStops(selected ? selected.stops : []);
  };

  const handleSubmit = () => {
    if (!selectedRoute || !scheduledDate || !selectedConductor) {
      setError('Please fill all fields before submitting.');
      return;
    }
  
    const accessToken = localStorage.getItem('accessToken');
    const payload = {
      route_id: selectedRoute.id,
      scheduled_date: scheduledDate,
      status: status,
      conductor_id: selectedConductor.id,  // Add selected conductor to payload
    };
  
    axiosInstance.post(`/schedule-bus/${busId}/`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      Swal.fire({
        title: 'Success!',
        text: 'Bus scheduled successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      navigate('/busowner-dashboard/scheduled-bus-list');  
    })
    .catch(err => {
      console.log('Error:', err);
  
      if (err.response && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;
  
        Swal.fire({
          title: 'Error!',
          text: errorMessage, 
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to schedule bus. Please try again.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Bus Schedule</h1>
      </div>

      {loading && <div className="text-center text-lg text-gray-600">Loading...</div>}
      {error && <div className="text-center text-lg text-red-500">{error}</div>}

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

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Route, Conductor, and Schedule</h2>

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
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose Conductor</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={(e) => setSelectedConductor(conductors.find(conductor => conductor.id === parseInt(e.target.value)))}
            value={selectedConductor ? selectedConductor.id : ''}
          >
            <option value="">-- Select Conductor --</option>
            {conductors.map(conductor => (
              <option key={conductor.id} value={conductor.id}>{conductor.name}</option>
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
      </div>

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
