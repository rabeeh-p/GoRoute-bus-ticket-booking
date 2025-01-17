import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Normal/Navbar";
import { Calendar, Clock, IndianRupee, MapPin, Star } from 'lucide-react';
import Swal from 'sweetalert2';

const UserBusView = () => {
    const [busDetails, setBusDetails] = useState(null);
    const [error, setError] = useState("");
    const [logo, setLogo] = useState("");
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    console.log(busDetails, 'details');
    console.log(logo, 'logo');



    const naviagate = useNavigate()

    const { busId } = useParams();
    const searchParams = JSON.parse(localStorage.getItem('searchParams'));
    const { from, to, date } = searchParams;

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/bus-details/${busId}/`, {
                params: {
                    from_city: from,
                    to_city: to,
                    date: date
                }
            }
            )
            .then((response) => {
                console.log(response.data, 'dataaas');

                setBusDetails(response.data.bus);
                
                setBookedSeats(response.data.booked_seats);
                setLogo(response.data.bus_log)
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

          
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    

   

    

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }
        const searchParams = JSON.parse(localStorage.getItem('searchParams'));
        const { from, to, date } = searchParams;
    
        const formData = {
            bus_id: busId,
            seat_numbers: selectedSeats,
            userName: e.target.userName.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            to: to,
            from: from,
            date: date
        };
    
        Swal.fire({
            title: 'Do you want to simulate a successful payment?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Proceed with Success',
            cancelButtonText: 'No, Simulate Failure'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://127.0.0.1:8000/seat-booking/', formData, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }).then((response) => {
                    if (response.data.message) {
                        const options = {
                            key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                            amount: response.data.total_amount * 100,  
                            currency: "INR",
                            name: "Bus Booking",
                            description: "Test Transaction",
                            order_id: response.data.razorpay_order_id,
                            handler: function (paymentResponse) {
                                console.log("Payment Response:", paymentResponse);   
    
                                const paymentId = paymentResponse.razorpay_payment_id;
                                const orderId = response.data.razorpay_order_id;  
                                const signature = paymentResponse.razorpay_signature;
    
                                if (!paymentId || !orderId || !signature) {
                                    Swal.fire("Error", "Missing payment details in the response.", "error");
                                    return;
                                }
    
                                axios.post('http://127.0.0.1:8000/payment-success/', {
                                    payment_id: paymentId,
                                    order_id: orderId,
                                    signature: signature
                                })
                                .then((paymentResponseBackend) => {
                                    Swal.fire("Success!", "Payment completed successfully.", "success");
                                    window.location.reload();
                                })
                                .catch((err) => {
                                    console.error("Payment verification error:", err.response.data);
                                    Swal.fire("Error!", "Payment verification failed.", "error");
                                });
                            },
                            prefill: {
                                name: e.target.userName.value,
                                email: e.target.email.value,
                                contact: e.target.phone.value,
                            },
                            theme: { color: "#3399cc" },
                        };
                        const rzp = new Razorpay(options);
                        rzp.open();
                    } else {
                        Swal.fire("Error", "Order creation failed.", "error");
                    }
                }).catch((error) => {
                    Swal.fire("Error", "Failed to connect to the server.", "error");
                });
            } else {
                Swal.fire("Payment Failed", "The payment was not successful. No seats have been booked.", "error");
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
        console.log(type, 'typeeeee');


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
            // case "semi_sleeper":
            //     baseStyle = "w-12 h-24 text-white rounded-md shadow-md cursor-pointer transition-all duration-200";
            //     break;
            case "semi_sleeper":
                baseStyle = "w-10 h-12 bg-gray-300 text-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:bg-blue-500 hover:scale-105 active:scale-95";
                break;

            case "full_sleeper":
                baseStyle = "w-12 h-24 text-white rounded-md shadow-md cursor-pointer transition-all duration-200";
                break;
            default:
                baseStyle = "w-8 h-8 text-white rounded-md shadow-md cursor-pointer transition-all duration-200";
        }

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
                    <div className="w-1/2">{renderDeck(upperDeckSeats, "Lower Deck")}</div>
                    <div className="w-1/2">{renderDeck(lowerDeckSeats, "Upper Deck")}</div>
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
                {/* <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">{busDetails.bus_owner_name}</h2>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Bus Name:</span> {busDetails.name}</p>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Bus Number:</span> {busDetails.bus_number}</p>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Bus Type:</span> {busDetails.bus_type}</p>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Route:</span> {busDetails.route}</p>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Seat Type:</span> {busDetails.seat_type}</p>
                    <p className="text-gray-700 mb-2">
                        <span className="font-medium">Scheduled Date:</span> {new Date(busDetails.scheduled_date).toLocaleString()}
                    </p>
                    <p className="text-gray-700 mb-2"><span className="font-medium">Seats Available:</span> {busDetails.seat_count}</p>
                </div> */}
                <div className="bg-gray-50 p-6 rounded-lg shadow mb-6 flex flex-col lg:flex-row justify-between">
                    <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                            {/* Add the logo image here */}
                            <img
                                src={`http://127.0.0.1:8000/${logo}`}  
                                alt="Bus Owner Logo"
                                className="w-12 h-12 rounded-full mr-4" 
                            />
                            {busDetails.bus_owner_name}
                        </h2>
                        <p className="text-gray-700 mb-2"><span className="font-medium">Bus Name:</span> {busDetails.name}</p>
                        <p className="text-gray-700 mb-2"><span className="font-medium">Bus Number:</span> {busDetails.bus_number}</p>
                        <p className="text-gray-700 mb-2"><span className="font-medium">Bus Type:</span> {busDetails.bus_type}</p>
                        <p className="text-gray-700 mb-2"><span className="font-medium">Route:</span> {busDetails.route}</p>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <p className="text-gray-700 mb-2"><span className="font-medium">Seat Type:</span> {busDetails.seat_type}</p>
                        <p className="text-gray-700 mb-2">
                            <span className="font-medium">Scheduled Date:</span> {new Date(busDetails.scheduled_date).toLocaleString()}
                        </p>
                        <p className="text-gray-700 mb-2"><span className="font-medium">Seats Available:</span> {busDetails.seat_count}</p>
                    </div>
                </div>







                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-red-500" />
                                <div>
                                    <p className="text-sm text-gray-500">From</p>
                                    <p className="font-semibold">{from}</p>
                                </div>
                            </div>
                            <div className="h-0.5 w-8 bg-gray-300" />
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-red-500" />
                                <div>
                                    <p className="text-sm text-gray-500">To</p>
                                    <p className="font-semibold">{to}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-red-500" />
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-semibold">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
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