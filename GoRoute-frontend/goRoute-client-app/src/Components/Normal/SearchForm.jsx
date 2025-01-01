import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

const SearchForm = () => {
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
                className="w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300">
          Search Buses
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
