import React, { useState, useEffect } from "react";
import { Bus, MapPin } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BusOwnerTracking = () => {
  const [busData, setBusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [busPosition, setBusPosition] = useState(0);
  const [busStarted, setBusStarted] = useState(false);  
  const { busId } = useParams();

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/owner-bus-tracking/${busId}/`);
        const data = response.data;
        console.log(response.data,'bus tracing');
        
        setBusData(data);
        setLoading(false);

        if (data && data.current_stop && data.total_stops) {
          const currentIndex = data.current_stop.stop_number;
          setCurrentStopIndex(currentIndex);

          if (data.total_stops.length > 1) {
            setBusPosition((currentIndex / (data.total_stops.length - 1)) * 100);
          }
        }
      } catch (error) {
        console.error("Error fetching bus data:", error);
        setLoading(false);
      }
    };

    fetchBusData();
  }, [busId]);

  

  

  if (loading) {
    return <div className="text-center text-red-600 text-xl mt-8">Loading...</div>;
  }

  if (!busData) {
    return <div className="text-center text-red-600 text-xl mt-8">No data available</div>;
  }

  const { bus, current_stop, next_stops, total_stops } = busData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
        <div className="bg-red-600 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold flex items-center justify-center">
            <Bus className="mr-2" /> {bus.bus_number} - {bus.bus_owner_name}
          </h1>
          <p className="text-lg">{bus.route}</p>
          <p className="text-sm">Scheduled on: {new Date(bus.scheduled_date).toLocaleDateString()}</p>
        </div>
        <div className="p-6">
          {/* Current Location */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Current Location</h2>
            <div className="flex items-center justify-center space-x-4 p-4 bg-red-100 rounded-lg">
              <MapPin className="text-red-600" />
              <span className="text-lg font-medium text-red-600">
                {current_stop.stop_name || "End of Route"}
              </span>
            </div>
          </div>

          

          {/* Full Route Progress */}
          <div className="mb-8 relative">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Route Progress</h2>
            <div className="relative w-full h-6 bg-gray-200 rounded-full">
              {/* Bus Stops */}
              {total_stops.map((stop, index) => (
                <div
                  key={stop.stop_name}
                  className={`absolute top-0 transform -translate-x-1/2 w-4 h-4 rounded-full ${
                    index === currentStopIndex ? "bg-red-600" : "bg-gray-600"
                  }`}
                  style={{
                    left: `${(index / (total_stops.length - 1)) * 100}%`,
                  }}
                />
              ))}

              {/* Moving Bus Indicator */}
              <div
                className="absolute top-0 w-8 h-8 bg-red-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ease-in-out"
                style={{
                  left: `calc(${busPosition}% - 16px)`,
                  top: "-12px",
                }}
              >
                <Bus className="text-white w-5 h-5" />
              </div>
            </div>

            {/* Stop Labels */}
            <div className="flex justify-between mt-2 text-xs">
              {total_stops.map((stop, index) => (
                <div
                  key={stop.stop_name}
                  className={`text-center ${index === currentStopIndex ? "text-red-600 font-medium" : "text-gray-600"}`}
                  style={{
                    width: `${100 / total_stops.length}%`,
                  }}
                >
                  {stop.stop_name}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Stops */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Upcoming Stops</h2>
            <div className="space-y-4">
              {next_stops.map((stop) => (
                <div
                  key={stop.stop_name}
                  className="flex items-center justify-between bg-red-100 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <MapPin className="text-red-600" />
                    <span className="text-lg font-medium text-red-600">{stop.stop_name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{stop.arrival_time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Route Details */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Route Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="font-medium text-gray-600">From</div>
                <div className="text-lg text-red-600">{total_stops[0]?.stop_name}</div>
              </div>
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="font-medium text-gray-600">To</div>
                <div className="text-lg text-red-600">{total_stops[total_stops.length - 1]?.stop_name}</div>
              </div>
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="font-medium text-gray-600">Next Stop</div>
                <div className="text-lg text-red-600">
                  {next_stops[0]?.stop_name || "End of Route"}
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="font-medium text-gray-600">Estimated Arrival</div>
                <div className="text-lg text-red-600">
                  {next_stops[0]?.arrival_time || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition-all"
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusOwnerTracking;
