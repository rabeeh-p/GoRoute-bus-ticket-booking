import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axios';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../Hook/useLogout';

const AdminBusScheduledList = () => {
  const [scheduledBuses, setScheduledBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  useEffect(() => {
    const fetchScheduledBuses = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await axiosInstance.get('/busowner-dashboard/scheduled-buses-adminOnly/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setScheduledBuses(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleLogout();
        } else if (err.response && err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Failed to fetch bus data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledBuses();
  }, [navigate, handleLogout]);

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-red-700">Scheduled Bus List</h1>
      </header>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 mb-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-red-200 rounded-md shadow-md">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Bus Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Bus Type</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Seat Count</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Schedule Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-red-200">
              {scheduledBuses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center text-sm text-gray-500">
                    No scheduled buses available.
                  </td>
                </tr>
              ) : (
                scheduledBuses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-red-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{bus.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{bus.bus_type}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{bus.seat_count}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {new Date(bus.scheduled_date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() => navigate(`/admin-home/admin-track/${bus.id}/`)}
                        className="bg-red-700 text-white py-1 px-3 rounded hover:bg-red-800 transition duration-300"
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
      )}
    </div>
  );
};

export default AdminBusScheduledList;
