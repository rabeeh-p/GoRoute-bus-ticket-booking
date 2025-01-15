import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useLogout from '../../Hook/useLogout';

const AddRouteForm = () => {
  const [routeName, setRouteName] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [distanceInKm, setDistanceInKm] = useState("");
  const [startDatetime, setStartDatetime] = useState('');
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRoute = {
      routeName,
      startLocation,
      endLocation,
      distanceInKm,
      // startDatetime,
    };

    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken,'tocken');
    

    if (!accessToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please log in again.',
      });
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

      Swal.fire({
        icon: 'success',
        title: 'Route Created',
        text: 'The route has been successfully added!',
      });

      setRouteName("");
      setStartLocation("");
      setEndLocation("");
      setDistanceInKm("");
      setStartDatetime("");
      navigate('/busowner-dashboard/bus-owner/route-table')

    } catch (err) {
      console.error('Error:', err);

      if (err.response && err.response.status === 401) {
        handleLogout()
        
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: 'Your session has expired. Please log in again.',
        });
      } else if (err.response && err.response.data) {
        const errorMessage = Object.values(err.response.data)
          .flat()
          .join(' ');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage || 'Failed to create route. Please try again later.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create route. Please try again later.',
        });
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-red-600 mb-6">Add New Route</h2>

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
