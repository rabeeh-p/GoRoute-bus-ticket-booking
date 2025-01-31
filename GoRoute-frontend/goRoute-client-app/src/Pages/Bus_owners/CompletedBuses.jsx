import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axios';   
import { useNavigate } from 'react-router-dom';
import useLogout from '../../Hook/useLogout';

const CompletedBuses = () => {
  const [completedBuses, setCompletedBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');   
      return;
    }

    axiosInstance.get('/busowner-dashboard/completed-buses/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setCompletedBuses(response.data);
      setLoading(false);
    })
    .catch(err => {
      if (err.response && err.response.status === 401) {
        handleLogout();   
      } else if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to fetch bus data.');
      }
      setLoading(false);
    });

    return () => {
      setCompletedBuses([]);
    };
  }, [navigate]);

  return (
    <div className="container mx-auto p-6 bg-red-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-red-700">Completed Bus List</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 mb-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {loading && <div className="text-center text-lg text-gray-600">Loading...</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-red-300">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Bus Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Bus Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Seat Count</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Completed Date</th>
              {/* <th className="px-4 py-2 text-left text-sm font-semibold">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {completedBuses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-sm text-gray-500">No completed buses available.</td>
              </tr>
            ) : (
              completedBuses.map(bus => (
                <tr key={bus.id} className="hover:bg-red-100">
                  <td className="px-4 py-2 text-sm text-red-900 font-semibold">{bus.name}</td>
                  <td className="px-4 py-2 text-sm">{bus.bus_type}</td>
                  <td className="px-4 py-2 text-sm">{bus.seat_count}</td>
                  <td className="px-4 py-2 text-sm">{new Date(bus.scheduled_date).toLocaleString()}</td>
                   
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedBuses;