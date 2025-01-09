import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axios';   
import { useNavigate } from 'react-router-dom';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  
  

  useEffect(() => {
    
    const accessToken = localStorage.getItem('accessToken');
    setBuses([]);
   
    if (!accessToken) {
      navigate('/login');   
      return;
    }
    
    

    axiosInstance.get('/bus-list/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      
    })
    .then(response => {
      setBuses(response.data);
      setLoading(false);
      console.log('is working loading');
      
    })
    .catch(err => {
      setError('Failed to fetch bus data');
      setLoading(false);
    });

    return () => {
      setBuses([]);
    };
  }, [navigate]);

  const handleViewBus = (busId) => {
    navigate(`/bus-details/${busId}`);  
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bus List</h1>
        <button
          onClick={() => navigate('/busowner-dashboard/bus-owner/bus-add')}   
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Add Bus 
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Bus Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Bus Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Seat Count</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus.id}>
                <td className="px-4 py-2 text-sm">{bus.name}</td>
                <td className="px-4 py-2 text-sm">{bus.bus_type.name}</td>
                <td className="px-4 py-2 text-sm">{bus.bus_type.seat_count}</td>
                <td className="px-4 py-2 text-sm">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusList;
