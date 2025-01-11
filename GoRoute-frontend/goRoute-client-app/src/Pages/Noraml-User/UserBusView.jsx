import React, { useEffect, useState } from "react";
import axios from "axios";

const UserBusView = ({ busId }) => {
    const [busDetails, setBusDetails] = useState(null);
    const [seatLayout, setSeatLayout] = useState([]);

    useEffect(() => {
        // Fetch bus details and seat layout
        axios
            .get(`/api/bus-details/${busId}/`) // Adjust the endpoint as per your API
            .then((response) => {
                setBusDetails(response.data.bus);
                setSeatLayout(response.data.seats);
            })
            .catch((error) => {
                console.error("Error fetching bus details:", error);
            });
    }, [busId]);

    const renderSeatLayout = () => {
        const rows = [];
        let currentRow = [];

        // Assuming 4 seats per row for simplicity
        seatLayout.forEach((seat, index) => {
            currentRow.push(seat);

            if ((index + 1) % 4 === 0 || index === seatLayout.length - 1) {
                rows.push(currentRow);
                currentRow = [];
            }
        });

        return rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-2 mb-4">
                {row.map((seat) => (
                    <div
                        key={seat.seat_number}
                        className={`w-10 h-10 text-center rounded-md ${
                            seat.status === "booked"
                                ? "bg-red-500 text-white"
                                : "bg-green-500 text-black"
                        }`}
                        title={`Seat ${seat.seat_number} (${seat.type})`}
                    >
                        {seat.seat_number}
                    </div>
                ))}
            </div>
        ));
    };

    if (!busDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">{busDetails.bus_owner_name}</h2>
            <p className="text-gray-700 mb-2">Bus Type: {busDetails.bus_type}</p>
            <p className="text-gray-700 mb-6">Total Seats: {busDetails.seat_count}</p>

            <div>
                <h3 className="text-xl font-semibold mb-2">Seat Layout</h3>
                <div className="bg-white p-4 rounded-lg shadow">{renderSeatLayout()}</div>
            </div>
        </div>
    );
};

export default UserBusView;
