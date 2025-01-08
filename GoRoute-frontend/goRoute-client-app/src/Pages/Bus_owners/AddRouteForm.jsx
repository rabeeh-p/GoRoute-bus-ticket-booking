import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRouteForm = () => {
  const [routeName, setRouteName] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [distanceInKm, setDistanceInKm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRoute = {
      routeName,
      startLocation,
      endLocation,
      distanceInKm,
    };

    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken,'access');
    

    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/bus-owner/routes/",  
        newRoute,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Route Created:", response.data);
      setRouteName("");
      setStartLocation("");
      setEndLocation("");
      setDistanceInKm("");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userType');
        navigate('/login');
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to create route. Please try again later.');
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/login');
      return;
    }

    axios.get("http://localhost:8000/verify-token/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      console.log('Token is valid', response.data);
    })
    .catch(err => {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userType');
        navigate('/login');
        setError('Session expired. Please log in again.');
      }
    });
  }, [navigate]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-red-600 mb-6">Add New Route</h2>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="routeName" className="block text-lg font-medium text-gray-700 mb-2">
              Route Name
            </label>
            <input
              id="routeName"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="startLocation" className="block text-lg font-medium text-gray-700 mb-2">
              Start Location
            </label>
            <input
              id="startLocation"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="endLocation" className="block text-lg font-medium text-gray-700 mb-2">
              End Location
            </label>
            <input
              id="endLocation"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="distanceInKm" className="block text-lg font-medium text-gray-700 mb-2">
              Distance (km)
            </label>
            <input
              id="distanceInKm"
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              value={distanceInKm}
              onChange={(e) => setDistanceInKm(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              Add Route
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRouteForm;
