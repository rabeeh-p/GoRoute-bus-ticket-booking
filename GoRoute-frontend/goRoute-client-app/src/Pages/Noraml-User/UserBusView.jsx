import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Normal/Navbar";

const UserBusView = () => {
    const [busDetails, setBusDetails] = useState(null);
    const [error, setError] = useState("");
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isBooking, setIsBooking] = useState(false); // B

    console.log(busDetails,'details');
    

    const naviagate = useNavigate()

    const { busId } = useParams();

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/bus-details/${busId}/`)
            .then((response) => {
                console.log(response.data.booked_seats,'dataaas');
                
                setBusDetails(response.data.bus);
                // setBookedSeats([3, 7, 12,20]);
                setBookedSeats(response.data.booked_seats);
            })
            .catch((error) => {
                console.error("Error fetching bus details:", error);
                setError("Could not fetch bus details.");
            });
    }, [busId]);

    const handleBookNowClick = () => {
        const userType = localStorage.getItem('userType');
        if (!userType) {
            naviagate('/login')

        } else {
            setIsModalOpen(true);
        }

        // setIsModalOpen(true);  
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // const handleFormSubmit = (e) => {
    //     e.preventDefault();
    //     alert("Booking successful!");
    //     setIsModalOpen(false);
    // };

    const handleFormSubmit = (e) => {
        
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      naviagate('/login');   
      return;
    }
    
        // Prepare the data to be sent to the server
        const formData = {
            bus_id: busId, // Replace with the correct bus ID if needed
            seat_numbers: selectedSeats, // Array of selected seats
            userName: e.target.userName.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
        };
    
        // Make the API call to submit the booking
        axios.post('http://127.0.0.1:8000/seat-booking/', formData,
            {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
        )
            .then((response) => {
                if (response.data.message) {
                    // Handle success - Booking successful
                    alert("Booking successful!");
                    setIsModalOpen(false);
                    window.location.reload();
                } else {
                    // Handle unexpected response format
                    alert(`Unexpected response: ${JSON.stringify(response.data)}`);
                }
            })
            .catch((error) => {
                // Handle any errors (network, server, etc.)
                if (error.response) {
                    // The server responded with a status other than 200 range
                    alert(`Error: ${error.response.data.error || 'Something went wrong'}`);
                } else if (error.request) {
                    // No response was received
                    alert('Error: No response from the server.');
                } else {
                    // Something else went wrong
                    alert(`Error: ${error.message}`);
                }
            });
    };

    const handleSeatClick = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) {
            return;
        }

        setSelectedSeats((prev) => {
            if (prev.includes(seatNumber)) {
                return prev.filter((seat) => seat !== seatNumber);
            } else {
                return [...prev, seatNumber];
            }
        });
    };

    const getSeatStyle = (type, seatNumber) => {
        let baseStyle = "";

        switch (type) {
            case "standard":
                baseStyle = "w-8 h-8 text-white rounded-md shadow-md cursor-pointer transition-all duration-200";
                break;
            case "recliner":
                baseStyle = "w-12 h-12 text-white rounded-lg shadow-lg cursor-pointer transition-all duration-200";
                break;
            case "luxury":
                baseStyle = "w-16 h-16 text-black rounded-full shadow-lg cursor-pointer transition-all duration-200";
                break;
            case "semi_sleeper":
                baseStyle = "w-12 h-24 text-white rounded-md shadow-md cursor-pointer transition-all duration-200";
                break;
            case "full_sleeper":
                baseStyle = "w-12 h-24 text-white rounded-md shadow-md cursor-pointer transition-all duration-200";
                break;
            default:
                baseStyle = "w-8 h-8 text-white rounded-md shadow-md cursor-pointer transition-all duration-200";
        }

        // Add color based on seat status
        if (bookedSeats.includes(seatNumber)) {
            return `${baseStyle} bg-red-500 cursor-not-allowed opacity-70`;
        } else if (selectedSeats.includes(seatNumber)) {
            return `${baseStyle} bg-green-500 ring-2 ring-green-600 transform scale-105`;
        } else {
            return `${baseStyle} bg-gray-400 hover:bg-gray-500`;
        }
    };

    const renderSeatLayout = () => {
        const { seat_count, seat_type } = busDetails;

        if (!seat_count || typeof seat_count !== "number" || seat_count <= 0) {
            return <p className="text-gray-600">No seat data available.</p>;
        }

        const totalRows = Math.ceil(seat_count / 5);
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
                <div className="flex justify-center space-x-8 mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Booked</span>
                    </div>
                </div>
                {leftSeatRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex space-x-8 justify-center mb-2">
                        {/* Left Side Seats */}
                        <div className="flex space-x-4">
                            {row.map((seat) => (
                                <div
                                    key={seat}
                                    className={getSeatStyle(seat_type, seat)}
                                    onClick={() => handleSeatClick(seat)}
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        {seat}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Side Seats */}
                        <div className="flex space-x-4">
                            {rightSeatRows[rowIndex]?.map((seat) => (
                                <div
                                    key={seat}
                                    className={getSeatStyle(seat_type, seat)}
                                    onClick={() => handleSeatClick(seat)}
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        {seat}
                                    </div>
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
                                            className={getSeatStyle(seat_type, seat)}
                                            onClick={() => handleSeatClick(seat)}
                                        >
                                            <div className="w-full h-full flex items-center justify-center">
                                                {seat}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Side Seats */}
                                <div className="flex space-x-4">
                                    {rightSeatRows[rowIndex]?.map((seat) => (
                                        <div
                                            key={seat}
                                            className={getSeatStyle(seat_type, seat)}
                                            onClick={() => handleSeatClick(seat)}
                                        >
                                            <div className="w-full h-full flex items-center justify-center">
                                                {seat}
                                            </div>
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
            <div className="flex flex-col space-y-8">
                <div className="flex justify-center space-x-8 mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Booked</span>
                    </div>
                </div>
                <div className="flex space-x-12">
                    <div className="w-1/2">{renderDeck(upperDeckSeats, "Upper Deck")}</div>
                    <div className="w-1/2">{renderDeck(lowerDeckSeats, "Lower Deck")}</div>
                </div>
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
                {/* Bus Details Section */}
                <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">{busDetails.bus_owner_name}</h2>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Bus Name:</span> {busDetails.name}</p>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Bus Number:</span> {busDetails.bus_number}</p>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Bus Type:</span> {busDetails.bus_type}</p>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Route:</span> {busDetails.route}</p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-medium">Scheduled Date:</span> {new Date(busDetails.scheduled_date).toLocaleString()}
                    </p>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Seats Available:</span> {busDetails.seat_count}</p>
                </div>

                {/* Seat Layout */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Seat Layout</h3>
                    <div className="bg-white p-6 rounded-lg shadow">
                        {busDetails.seat_type === "full_sleeper" ? renderDoubleDeck() : renderSeatLayout()}
                    </div>
                </div>

                {/* Selected Seats Section */}
                {selectedSeats.length > 0 && (
                    <div className="mt-6 bg-green-50 p-4 rounded-lg">
                        <h4 className="text-lg font-medium text-green-800 mb-2">Selected Seats</h4>
                        <p className="text-green-700">
                            Seats: {selectedSeats.sort((a, b) => a - b).join(", ")}
                        </p>
                    </div>
                )}

                {/* Book Now Button */}
                {selectedSeats.length > 0 && (
                    <div className="mt-4 text-center">
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                            onClick={handleBookNowClick}
                        >
                            Book Now
                        </button>
                    </div>
                )}
            </div>

            {/* Modal for Booking Form */}
            {/* {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4">Booking Form</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label htmlFor="selectedSeats" className="block text-gray-700">
                                Selected Seats:
                            </label>
                            <input
                                type="text"
                                id="selectedSeats"
                                name="selectedSeats"
                                value={selectedSeats.join(", ")}
                                disabled
                                className="mt-2 p-2 w-full border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="userName" className="block text-gray-700">
                                Your Name:
                            </label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                className="mt-2 p-2 w-full border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">
                                Your Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-2 p-2 w-full border rounded-lg"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white py-2 px-4 rounded"
                        >
                            Confirm Booking
                        </button>
                    </form>
                    <button
                        className="mt-4 text-red-500"
                        onClick={handleModalClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        )} */}

            {/* {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Booking Form</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label htmlFor="selectedSeats" className="block text-gray-700">
                                    Selected Seats:
                                </label>
                                <input
                                    type="text"
                                    id="selectedSeats"
                                    name="selectedSeats"
                                    value={selectedSeats.join(", ")} // Array of selected seats
                                    disabled
                                    className="mt-2 p-2 w-full border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="userName" className="block text-gray-700">
                                    Your Name:
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    className="mt-2 p-2 w-full border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700">
                                    Your Email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-2 p-2 w-full border rounded-lg"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-2 px-4 rounded"
                            >
                                Confirm Booking
                            </button>
                        </form>
                        <button
                            className="mt-4 text-red-500"
                            onClick={handleModalClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )} */}


            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Booking Form</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label htmlFor="selectedSeats" className="block text-gray-700">
                                    Selected Seats:
                                </label>
                                <input
                                    type="text"
                                    id="selectedSeats"
                                    name="selectedSeats"
                                    value={selectedSeats.join(", ")} // Array of selected seats
                                    disabled
                                    className="mt-2 p-2 w-full border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="userName" className="block text-gray-700">
                                    Your Name:
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    className="mt-2 p-2 w-full border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700">
                                    Your Email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-2 p-2 w-full border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-gray-700">
                                    Your Phone Number:
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="mt-2 p-2 w-full border rounded-lg"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-2 px-4 rounded"
                            >
                                Confirm Booking
                            </button>
                        </form>
                        <button
                            className="mt-4 text-red-500"
                            onClick={handleModalClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}



        </>
    );
};

export default UserBusView;