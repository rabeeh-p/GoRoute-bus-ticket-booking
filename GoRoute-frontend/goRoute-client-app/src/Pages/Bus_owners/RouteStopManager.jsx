import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert
import axiosInstance from "../../axios/axios";
import { useParams } from "react-router-dom";

const RouteStopsManager = () => {
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stopName, setStopName] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [distance_in_km, setDistance_in_km] = useState("");

  const { routeId } = useParams("id");
  console.log('route',routeId);
  

  useEffect(() => {
    
    const fetchRouteStops = async () => {
      const accessToken = localStorage.getItem('accessToken');  
  
      if (!accessToken) {
        navigate('/admin-login');  
        return;
      }
      
      try {
        const response = await axiosInstance.get(`routes/${routeId}/stops/`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,   
          },
        });
        if (response.status === 200) {
          setRouteStops(response.data);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch route stops. Please try again later.",
        });
        console.error("Error fetching stops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteStops();
  }, [routeId]);

  const handleAddStop = async (e) => {
    e.preventDefault();

    const newStop = {
      route: routeId,
      stop_name: stopName,
      stop_order: routeStops.length + 1,
      arrival_time: arrivalTime,
      departure_time: departureTime,
      distance_in_km: distance_in_km,
    };

    try {
      const response = await axiosInstance.post(`routes/${routeId}/stops/`, newStop);
      if (response.status === 201) {
        setRouteStops([...routeStops, response.data]);
        setStopName("");
        setArrivalTime("");
        setDepartureTime("");
        setDistance_in_km("");

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Stop added successfully!",
        });
      }
    } catch (error) {
        console.log(error.response.data,'data kmmmm');
        
      const errorMessage =
        error.response?.data?.detail || "Failed to add the stop. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
      console.error("Error adding stop:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-red-600 mb-6">Manage Route Stops</h1>

        {/* Form to add a new stop */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Stop</h2>
          <form onSubmit={handleAddStop}>
            <div className="mb-4">
              <label htmlFor="stopName" className="block text-sm font-medium text-gray-700">
                Stop Name
              </label>
              <input
                type="text"
                id="stopName"
                value={stopName}
                onChange={(e) => setStopName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">
                  Arrival Time
                </label>
                <input
                  type="time"
                  id="arrivalTime"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">
                  Departure Time
                </label>
                <input
                  type="time"
                  id="departureTime"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Distance (in km)
              </label>
              <input
                type="text"
                id="duration"
                value={distance_in_km}
                onChange={(e) => setDistance_in_km(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
            >
              Add Stop
            </button>
          </form>
        </div>

        {/* Route Stops Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Stop Name</th>
                <th className="px-4 py-2">Arrival Time</th>
                <th className="px-4 py-2">Departure Time</th>
                <th className="px-4 py-2">Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {routeStops.length > 0 ? (
                routeStops.map((stop, index) => (
                  <tr
                    key={stop.id}
                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-2">{stop.stop_order}</td>
                    <td className="px-4 py-2">{stop.stop_name}</td>
                    <td className="px-4 py-2">{stop.arrival_time}</td>
                    <td className="px-4 py-2">{stop.departure_time}</td>
                    <td className="px-4 py-2">{stop.distance_in_km} km</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-600 font-medium">
                    No stops available for this route.
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

export default RouteStopsManager;
