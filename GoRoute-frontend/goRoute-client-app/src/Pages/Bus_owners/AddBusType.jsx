import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axios';
import useLogout from '../../Hook/useLogout';

const AddBusType = () => {
  const [busType, setBusType] = useState({
    name: '',
    seat_type: '',
    seat_count: '',
    description: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { handleLogout } = useLogout();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');  

    if (!accessToken) {
      navigate('/admin-login');  
      return;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusType({
      ...busType,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');  

    if (!accessToken) {
      setError('Session expired. Please log in again.');
      navigate('/admin-login');   
      return;
    }

    setLoading(true);   

    axiosInstance.post('add_bus_type/', busType, {
     
    })
      .then(response => {
        setMessage('Bus Type added successfully!');
        setLoading(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          handleLogout();  

          setError('Session expired. Please log in again.');
        } else {
          setError('Failed to add bus type. Please try again.');
        }
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full sm:w-96 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-red-500 mb-6">Add a New Bus Type</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Bus Type</label>
            <select
              id="name"
              name="name"
              value={busType.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Bus Type</option>
              <option value="ac">AC Bus</option>
              <option value="sleeper_ac">Sleeper AC Bus</option>
              <option value="non_ac_sleeper">Non-AC Sleeper</option>
              <option value="semi_sleeper">Semi Sleeper</option>
            </select>
          </div>

          <div>
            <label htmlFor="seat_type" className="block text-sm font-medium text-gray-700">Seat Type</label>
            <select
              id="seat_type"
              name="seat_type"
              value={busType.seat_type}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Seat Type</option>
              <option value="standard">Standard</option>
              <option value="recliner">Recliner</option>
              <option value="luxury">Luxury</option>
              <option value="semi_sleeper">Semi Sleeper</option>
              <option value="full_sleeper">Full Sleeper</option>
            </select>
          </div>

          <div>
            <label htmlFor="seat_count" className="block text-sm font-medium text-gray-700">Seat Count</label>
            <select
              id="seat_count"
              name="seat_count"
              value={busType.seat_count}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Seat Count</option>
              <option value="20">20 Seats</option>
              <option value="30">30 Seats</option>
              <option value="40">40 Seats</option>
              <option value="50">50 Seats</option>
              <option value="60">60 Seats</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={busType.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Adding Bus Type...' : 'Add Bus Type'}
          </button>
        </form>

        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default AddBusType;
