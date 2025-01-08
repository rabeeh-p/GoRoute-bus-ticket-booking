import React, { useState, useEffect } from "react";
import axiosInstance from '../../axios/axios';   

const RouteStopsManager = ({ routeId }) => {
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stopName, setStopName] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [duration, setDuration] = useState("");
  const [stopOrder, setStopOrder] = useState(1);

  console.log('is working');
  

  useEffect(() => {
    const fetchRouteStops = async () => {
      try {
        const response = await axiosInstance.get(`/api/routes/${routeId}/stops/`);
        if (response.status === 200) {
          setRouteStops(response.data);
        }
      } catch (error) {
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
      duration: duration,
    };

    try {
      const response = await axiosInstance.post(`/api/routes/${routeId}/stops/`, newStop);
      if (response.status === 201) {
        setRouteStops([...routeStops, response.data]); 
        setStopName("");
        setArrivalTime("");
        setDepartureTime("");
        setDuration("");
      }
    } catch (error) {
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
                Duration
              </label>
              <input
                type="text"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
                <th className="px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {routeStops.length > 0 ? (
                routeStops.map((stop, index) => (
                  <tr key={stop.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="px-4 py-2">{stop.stop_order}</td>
                    <td className="px-4 py-2">{stop.stop_name}</td>
                    <td className="px-4 py-2">{stop.arrival_time}</td>
                    <td className="px-4 py-2">{stop.departure_time}</td>
                    <td className="px-4 py-2">{stop.duration}</td>
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
