import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axios';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const RestartBus = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [busDetails, setBusDetails] = useState(null);
  const [conductors, setConductors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConductor, setSelectedConductor] = useState('');
  const [newScheduleDate, setNewScheduleDate] = useState('');

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
      .catch(() => setError('Failed to fetch bus details'));

    axiosInstance.get('/conductors/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        const inactiveConductors = response.data.filter(conductor => !conductor.is_active);
        setConductors(inactiveConductors);
      })
      .catch(() => setError('Failed to fetch conductors'));
  }, [busId, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
  
    if (!selectedConductor || !newScheduleDate) {
      setError("Please select a conductor and set a new schedule date.");
      return;
    }
  
    try {
      const response = await axios.post(`http://127.0.0.1:8000/reschedule-bus/${busId}/`, {
        conductor_id: selectedConductor,
        scheduled_date: newScheduleDate
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.status === 200) {
        alert("Bus restarted successfully");
        setSelectedConductor('');  // Reset conductor selection
        setNewScheduleDate('');    // Reset schedule date
      }
    } catch (err) {
      console.error("Error restarting bus:", err);
      setError("An error occurred while restarting the bus. Please try again.");
    }
  };
  

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      {error && <div className="bg-red-100 text-red-800 p-3 mb-4 rounded-md">{error}</div>}
      {loading ? <div className="text-center text-lg text-gray-600">Loading...</div> : (
        <>
          <h1 className="text-3xl font-semibold text-gray-700 mb-4">Restart Bus</h1>
          <div className="border p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold text-gray-800">{busDetails.name}</h2>
            <p><strong>Bus Number:</strong> {busDetails.bus_number}</p>
            <p><strong>Route:</strong> {busDetails.route}</p>
            <p><strong>Bus Type:</strong> {busDetails.bus_type}</p>
            <p><strong>Seat Count:</strong> {busDetails.seat_count}</p>
            <p><strong>Scheduled Date:</strong> {new Date(busDetails.scheduled_date).toLocaleString()}</p>
            <p><strong>Description:</strong> {busDetails.description}</p>
            <h3 className="text-xl font-semibold mt-4">Stops:</h3>
            <ul className="list-disc pl-5">
              {busDetails.stops.map(stop => (
                <li key={stop.id}>{stop.stop_order}. {stop.stop_name} (Arr: {stop.arrival_time}, Dep: {stop.departure_time})</li>
              ))}
            </ul>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-6 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Restart Bus Schedule</h2>
            <label className="block mb-2">Select Conductor:</label>
            <select 
              value={selectedConductor} 
              onChange={(e) => setSelectedConductor(e.target.value)} 
              className="w-full border p-2 rounded-md mb-4"
            >
              <option value="">Select a conductor</option>
              {conductors.map(conductor => (
                <option key={conductor.id} value={conductor.id}>{conductor.name}</option>
              ))}
            </select>

            <label className="block mb-2">New Schedule Date:</label>
            <input 
              type="datetime-local" 
              value={newScheduleDate} 
              onChange={(e) => setNewScheduleDate(e.target.value)} 
              className="w-full border p-2 rounded-md mb-4"
            />

            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Restart Bus
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default RestartBus;
