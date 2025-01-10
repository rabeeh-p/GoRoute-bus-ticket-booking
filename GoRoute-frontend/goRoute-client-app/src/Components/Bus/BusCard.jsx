import React from "react";

const BusCard = ({ busNumber, busType, ownerName, seatType, seatCount, route, scheduledDate, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        {busNumber} - {busType}
      </h1>
      <p className="text-gray-600 text-lg">Owner: {ownerName}</p>
      <p className="text-gray-600 text-lg">Seat Type: {seatType}</p>
      <p className="text-gray-600 text-lg">Seat Count: {seatCount}</p>
      <p className="text-gray-600 text-lg">Route: {route}</p>
      <p className="text-gray-600 text-lg">
        Scheduled Date: {new Date(scheduledDate).toLocaleString()}
      </p>
      <p className="text-gray-600 text-lg">
        Description: {description || "No description provided"}
      </p>
    </div>
  );
};

export default BusCard;
