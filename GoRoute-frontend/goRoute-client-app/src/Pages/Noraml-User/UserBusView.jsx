import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../../Components/Normal/Navbar";

const UserBusView = () => {
    const [busDetails, setBusDetails] = useState(null);
    const [error, setError] = useState("");

    const { busId } = useParams();

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/bus-details/${busId}/`)
            .then((response) => {
                setBusDetails(response.data.bus);
            })
            .catch((error) => {
                console.error("Error fetching bus details:", error);
                setError("Could not fetch bus details.");
            });
    }, [busId]);

    // Get Seat Styles Based on Seat Type
    const getSeatStyle = (type) => {
        switch (type) {
            case "standard":
                return "w-8 h-8 bg-gray-400 text-white rounded-md shadow-md";
            case "recliner":
                return "w-12 h-12 bg-blue-400 text-white rounded-lg shadow-lg";
            case "luxury":
                return "w-16 h-16 bg-yellow-500 text-black rounded-full shadow-lg";
            case "semi_sleeper":
                return "w-12 h-24 bg-purple-400 text-white rounded-md shadow-md";
            case "full_sleeper":
                return "w-12 h-24 bg-green-500 text-white rounded-md shadow-md";
            default:
                return "w-8 h-8 bg-gray-400 text-white rounded-md shadow-md";
        }
    };

    const renderSeatLayout = () => {
        const { seat_count, seat_type } = busDetails;

        if (!seat_count || typeof seat_count !== "number" || seat_count <= 0) {
            return <p className="text-gray-600">No seat data available.</p>;
        }

        const totalRows = Math.ceil(seat_count / 5); // Two on the left, three on the right
        const seats = Array.from({ length: seat_count }, (_, index) => index + 1);

        const leftSeats = seats.filter((_, index) => index % 5 < 2);
        const rightSeats = seats.filter((_, index) => index % 5 >= 2);

        const leftSeatRows = Array.from({ length: totalRows }, (_, row) =>
            leftSeats.slice(row * 2, row * 2 + 2)
        );
        const rightSeatRows = Array.from({ length: totalRows }, (_, row) =>
            rightSeats.slice(row * 3, row * 3 + 3)
        );

        return (
            <div className="flex flex-col space-y-4">
                {leftSeatRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex space-x-8 justify-center mb-2">
                        {/* Left Side Seats */}
                        <div className="flex space-x-4">
                            {row.map((seat) => (
                                <div
                                    key={seat}
                                    className={`${getSeatStyle(seat_type)} flex items-center justify-center`}
                                >
                                    {seat}
                                </div>
                            ))}
                        </div>

                        {/* Right Side Seats */}
                        <div className="flex space-x-4">
                            {rightSeatRows[rowIndex]?.map((seat) => (
                                <div
                                    key={seat}
                                    className={`${getSeatStyle(seat_type)} flex items-center justify-center`}
                                >
                                    {seat}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderDoubleDeck = () => {
        const { seat_count, seat_type } = busDetails;
        const halfSeatCount = Math.floor(seat_count / 2);
        const seats = Array.from({ length: seat_count }, (_, index) => index + 1);

        const upperDeckSeats = seats.slice(0, halfSeatCount);
        const lowerDeckSeats = seats.slice(halfSeatCount);

        const renderDeck = (deckSeats, label) => {
            const totalRows = Math.ceil(deckSeats.length / 3);
            const leftSeats = deckSeats.filter((_, index) => index % 3 === 0);
            const rightSeats = deckSeats.filter((_, index) => index % 3 !== 0);

            const leftSeatRows = Array.from({ length: totalRows }, (_, row) =>
                leftSeats.slice(row * 1, row * 1 + 1)
            );
            const rightSeatRows = Array.from({ length: totalRows }, (_, row) =>
                rightSeats.slice(row * 2, row * 2 + 2)
            );

            return (
                <div className="w-full space-y-4">
                    <h3 className="text-gray-700 font-medium text-center">{label}</h3>
                    <div className="flex flex-col space-y-4 justify-center">
                        {leftSeatRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex space-x-8 justify-center mb-2">
                                {/* Left Side Seats */}
                                <div className="flex space-x-4">
                                    {row.map((seat) => (
                                        <div
                                            key={seat}
                                            className={`${getSeatStyle(seat_type)} flex items-center justify-center`}
                                        >
                                            {seat}
                                        </div>
                                    ))}
                                </div>

                                {/* Right Side Seats */}
                                <div className="flex space-x-4">
                                    {rightSeatRows[rowIndex]?.map((seat) => (
                                        <div
                                            key={seat}
                                            className={`${getSeatStyle(seat_type)} flex items-center justify-center`}
                                        >
                                            {seat}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        return (
            <div className="flex space-x-12">
                <div className="w-1/2">{renderDeck(upperDeckSeats, "Upper Deck")}</div>
                <div className="w-1/2">{renderDeck(lowerDeckSeats, "Lower Deck")}</div>
            </div>
        );
    };

    if (error) {
        return <p className="text-red-600 text-center">{error}</p>;
    }

    if (!busDetails) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
                <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">{busDetails.bus_owner_name}</h2>
                    <p className="text-gray-700 mb-2">
                        <span className="font-medium">Bus Name:</span> {busDetails.name}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-medium">Bus Number:</span> {busDetails.bus_number}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-medium">Bus Type:</span> {busDetails.bus_type}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-medium">Route:</span> {busDetails.route}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-medium">Scheduled Date:</span> {new Date(busDetails.scheduled_date).toLocaleString()}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-medium">Seats Available:</span> {busDetails.seat_count}
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Seat Layout</h3>
                    <div className="bg-white p-6 rounded-lg shadow">
                        {busDetails.seat_type === "full_sleeper" ? renderDoubleDeck() : renderSeatLayout()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserBusView;
