import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import { useNavigate, useParams } from "react-router-dom";
import BusCard from "../../Components/Bus/BusCard"; // Adjust the path based on your file structure

const ScheduledBusDetails = () => {
  const { busId } = useParams();
  const [busDetails, setBusDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    axiosInstance
      .get(`/scheduled-buses/${busId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setBusDetails(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setError("Failed to fetch bus details");
        setLoading(false);
      });
  }, [busId, navigate]);

  if (loading) {
    return <div className="text-center text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  const renderSeatLayout = () => {
    const { seat_count } = busDetails;
  
    if (!seat_count || typeof seat_count !== "number" || seat_count <= 0) {
      return <p className="text-gray-600">No seat data available.</p>;
    }
  
    const totalRows = Math.ceil(seat_count / 3);  
  
    const leftSideSeats = Array.from({ length: totalRows }, (_, index) => ({
      id: index + 1,
      number: index * 3 + 1,  
    }));
  
    const rightSideSeats = Array.from({ length: totalRows }, (_, index) => ({
      id: index + 1,
      seat1: index * 3 + 2,  
      seat2: index * 3 + 3,  
    }));
  
    const halfSeatCount = Math.floor(seat_count / 2);
    
    const upperDeckLeftSeats = leftSideSeats.slice(0, Math.ceil(halfSeatCount / 3));
    const upperDeckRightSeats = rightSideSeats.slice(0, Math.ceil(halfSeatCount / 3));
  
    const lowerDeckLeftSeats = leftSideSeats.slice(Math.ceil(halfSeatCount / 3), Math.ceil(halfSeatCount / 3) + Math.floor(halfSeatCount / 3));
    const lowerDeckRightSeats = rightSideSeats.slice(Math.ceil(halfSeatCount / 3), Math.ceil(halfSeatCount / 3) + Math.floor(halfSeatCount / 3));
  
    const renderDeck = (leftSeats, rightSeats, label) => (
      <div className="w-full space-y-4">
        <h3 className="text-gray-700 font-medium text-center">{label}</h3>
        <div className="flex flex-col space-y-4 justify-center">

          {leftSeats.map((seat, index) => (
            <div key={seat.id} className="flex space-x-8 justify-center mb-2">
              <div
                className={`w-12 h-24 bg-green-500 text-white flex items-center justify-center rounded-md shadow-md`}
              >
                {seat.number}
              </div>
  
              <div className="flex space-x-4">
                <div
                  className={`w-12 h-24 bg-green-500 text-white flex items-center justify-center rounded-md shadow-md`}
                >
                  {rightSeats[index].seat1}
                </div>
                <div
                  className={`w-12 h-24 bg-green-500 text-white flex items-center justify-center rounded-md shadow-md`}
                >
                  {rightSeats[index].seat2}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  
    return (
      <div className="flex space-x-12">
        <div className="w-1/2">{renderDeck(upperDeckLeftSeats, upperDeckRightSeats, "Upper Deck")}</div>
  
        <div className="w-1/2">{renderDeck(lowerDeckLeftSeats, lowerDeckRightSeats, "Lower Deck")}</div>
      </div>
    );
  };
  
  
  

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-red-600 text-white py-2 px-4 rounded-md mb-6 hover:bg-red-700 transition duration-300"
      >
        Back to List
      </button>

      <div className="grid lg:grid-cols-2 gap-6">
        <BusCard
          busNumber={busDetails.bus_number}
          busType={busDetails.bus_type}
          ownerName={busDetails.bus_owner_name}
          seatType={busDetails.seat_type}
          seatCount={busDetails.seat_count}
          route={busDetails.route}
          scheduledDate={busDetails.scheduled_date}
          description={busDetails.description}
        />

        {/* Route & Stops Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Route & Stops</h2>
          <div className="space-y-4">
            {busDetails.stops && busDetails.stops.length > 0 ? (
              busDetails.stops.map((stop, index) => (
                <div key={index} className="border-b border-gray-200 py-2">
                  <p className="font-semibold text-gray-800">
                    Stop {index + 1}: {stop.stop_name}
                  </p>
                  <p className="text-gray-600">Arrival Time: {stop.arrival_time}</p>
                  <p className="text-gray-600">Departure Time: {stop.departure_time}</p>
                  {stop.description && <p className="text-gray-600">Description: {stop.description}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No stops available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Bus Layout</h2>
        <div className="flex flex-col items-center">
          <div className="w-28 h-20 bg-gray-800 text-white flex items-center justify-center rounded-md shadow-md mb-4">
            Driver
          </div>
          {renderSeatLayout()}
        </div>
      </div>
    </div>
  );
};

export default ScheduledBusDetails;
