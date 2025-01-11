import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import axios from 'axios';

const SearchForm = () => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();   

  const handleSearch = async () => {
    setLoading(true);   
    setError('');   

    if (fromCity && toCity && date) {
      try {
        const response = await axios.get('http://127.0.0.1:8000/search_buses/', {
          params: { from: fromCity, to: toCity, date },
        });

        if (response.data && Array.isArray(response.data.buses)) {
          localStorage.setItem('searchParams', JSON.stringify({ from: fromCity, to: toCity, date }));

          if (response.data.buses.length > 0) {
            navigate('/trip-booking');  
          }
        } else {
          setError('No buses found.');
        }
      } catch (err) {
        setError('Error fetching buses');
        console.error('Error fetching buses:', err);
      } finally {
        setLoading(false);  
      }
    } else {
      setError('Please fill all the fields');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="flex items-center border rounded-md p-2">
              <MapPin className="h-5 w-5 text-red-600 mr-2" />
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="Enter source city"
                className="w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="flex items-center border rounded-md p-2">
              <MapPin className="h-5 w-5 text-red-600 mr-2" />
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Enter destination city"
                className="w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="flex items-center border rounded-md p-2">
              <Calendar className="h-5 w-5 text-red-600 mr-2" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full mt-4 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300"
        >
          {loading ? 'Loading...' : 'Search Buses'}
        </button>

        <div className="mt-6">
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
