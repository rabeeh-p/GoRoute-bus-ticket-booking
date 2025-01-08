import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RouteTable = () => {
  const [routes, setRoutes] = useState([]);  
  const [loading, setLoading] = useState(true);   
  const navigate =useNavigate()

  useEffect(() => {
    setTimeout(() => {
      const fetchedRoutes = [
        {
          id: 1,
          routeName: "City Express",
          startLocation: "New York",
          endLocation: "Boston",
          distanceInKm: 300,
        },
        {
          id: 2,
          routeName: "Mountain Journey",
          startLocation: "Denver",
          endLocation: "Aspen",
          distanceInKm: 200,
        },
      ];
      setRoutes(fetchedRoutes);
      setLoading(false);   
    }, 2000);   
  }, []);   

  const handleViewRoute = (route) => {
    alert(`Viewing route: ${route.routeName}`);
  };

  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading routes...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-red-600">Manage Routes</h1>
          <button
            onClick={()=> navigate('/busowner-dashboard/bus-owner/add-route')}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Add Route
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Route Name</th>
                <th className="px-4 py-2">Start Location</th>
                <th className="px-4 py-2">End Location</th>
                <th className="px-4 py-2">Distance (km)</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.length > 0 ? (
                routes.map((route, index) => (
                  <tr
                    key={route.id}
                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{route.routeName}</td>
                    <td className="px-4 py-2">{route.startLocation}</td>
                    <td className="px-4 py-2">{route.endLocation}</td>
                    <td className="px-4 py-2">{route.distanceInKm}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewRoute(route)}
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-600 font-medium"
                  >
                    No routes found. Add a route to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RouteTable;
