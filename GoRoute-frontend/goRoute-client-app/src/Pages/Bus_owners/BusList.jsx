import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axios';   
import { useNavigate } from 'react-router-dom';
import BusDetail from './BusDetail';
import useLogout from '../../Hook/useLogout';

const BusList = () => {
  const [approvedBuses, setApprovedBuses] = useState([]);
  const [pendingBuses, setPendingBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedBusId, setSelectedBusId] = useState(null);
  const { handleLogout } = useLogout();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
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
      const buses = response.data;
      console.log('buses',buses);
      
      setApprovedBuses(buses.filter(bus => bus.is_active && bus.Scheduled === false )); 
      setPendingBuses(buses.filter(bus => !bus.is_active)); 
      setLoading(false);
    })
    .catch(err => {
      if (err.response && err.response.status === 401) {
        handleLogout();  
      } else {
        setError('Failed to fetch bus data');
        setLoading(false);
      }
    });

    return () => {
      setApprovedBuses([]);
      setPendingBuses([]);
    };
  }, [navigate]);

  const handleViewBus = (busId) => {
    navigate(`/busowner-dashboard/bus-schedule/${busId}`);  
  };

  const EmptyMessage = ({ type }) => (
    <tr>
      <td colSpan="4" className="px-4 py-6 text-center text-lg text-gray-500">
        {type === 'pending' ? 'No pending buses available.' : 'No approved buses available.'}
      </td>
    </tr>
  );

  const handleViewClick = (busId) => {
    setSelectedBusId(busId);
  };

  const handleCloseDetail = () => {
    setSelectedBusId(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Bus List</h1>
        <button
          onClick={() => navigate('/busowner-dashboard/bus-owner/bus-add')}   
          className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
        >
          Add Bus 
        </button>
      </div>

      {loading && <div className="text-center text-lg text-gray-600">Loading...</div>}
      {error && <div className="text-center text-lg text-red-500">{error}</div>}

      <div className="overflow-x-auto mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Buses</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Bus Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Bus Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Seat Count</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingBuses.length === 0 ? (
              <EmptyMessage type="pending" />
            ) : (
              pendingBuses.map(bus => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{bus.name}</td>
                  <td className="px-4 py-2 text-sm">{bus.bus_type.name}</td>
                  <td className="px-4 py-2 text-sm">{bus.bus_type.seat_count}</td>
                  <td className="px-4 py-2 text-sm">
                    <button
                    onClick={() => handleViewClick(bus.id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {selectedBusId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <BusDetail busId={selectedBusId} onClose={handleCloseDetail} />
          </div>
        </div>
      )}
    

      <div className="overflow-x-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Approved Buses</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Bus Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Bus Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Seat Count</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedBuses.length === 0 ? (
              <EmptyMessage type="approved" />
            ) : (
              approvedBuses.map(bus => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{bus.name}</td>
                  <td className="px-4 py-2 text-sm">{bus.bus_type.name}</td>
                  <td className="px-4 py-2 text-sm">{bus.bus_type.seat_count}</td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() => handleViewBus(bus.id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Schedule
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusList;
