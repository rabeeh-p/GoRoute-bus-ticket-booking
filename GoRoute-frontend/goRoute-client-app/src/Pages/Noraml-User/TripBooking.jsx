import { useState } from 'react';
import Navbar from '../../Components/Normal/Navbar';
import { Calendar, Clock, IndianRupee, MapPin, Star } from 'lucide-react';

// import { MapPin, Calendar, Filter, Clock, Star, IndianRupee } from 'react-icons'; // Assuming you're using react-icons for these

const TripBooking = () => {
    const [from, setFrom] = useState('New York');
    const [to, setTo] = useState('Boston');
    const [date, setDate] = useState(new Date());
    const [filteredBuses, setFilteredBuses] = useState(mockBuses);

    const handleFilterChange = (e) => {
        // Handle filter logic (e.g., update filteredBuses based on selected filters)
    };

    return (
        <div>
            <Navbar />

            <div className="container mx-auto px-4 py-6 mt-24">
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
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar for Filters */}
                    <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-lg font-semibold">Filters</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">Bus Type</h3>
                                <div className="space-y-2">
                                    {["AC Sleeper", "AC Seater", "Non-AC Sleeper", "Non-AC Seater"].map((type) => (
                                        <label key={type} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="busType"
                                                value={type}
                                                onChange={handleFilterChange}
                                                className="rounded text-red-500 focus:ring-red-500"
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Departure Time</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: "Morning (6 AM - 12 PM)", value: "morning" },
                                        { label: "Afternoon (12 PM - 6 PM)", value: "afternoon" },
                                        { label: "Night (6 PM - 6 AM)", value: "night" },
                                    ].map((time) => (
                                        <label key={time.value} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="departure"
                                                value={time.value}
                                                className="text-red-500 focus:ring-red-500"
                                            />
                                            {time.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content for Bus List */}
                    <div className="md:col-span-3">
                        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Available Buses
                                </h2>
                                <div className="text-sm text-gray-600">
                                    {filteredBuses.length} buses found
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredBuses.map((bus) => (
                                <div
                                    key={bus.id}
                                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800">{bus.name}</h3>
                                            <p className="text-sm text-gray-600">{bus.type}</p>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">{bus.departureTime}</p>
                                                    <p className="text-sm text-gray-500">Departure</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">{bus.duration}</p>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">{bus.arrivalTime}</p>
                                                    <p className="text-sm text-gray-500">Arrival</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-5 h-5 text-yellow-400" />
                                                <span className="font-medium">{bus.rating}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{bus.seatsAvailable} seats left</p>
                                        </div>

                                        <div className="flex-1 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <IndianRupee className="w-5 h-5 text-gray-800" />
                                                <span className="text-xl font-bold text-gray-800">
                                                    {bus.price}
                                                </span>
                                            </div>
                                            <button className="mt-2 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors">
                                                Select Seats
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );



};

// Sample mock data for buses
const mockBuses = [
    {
        id: 1,
        name: 'Express Travels',
        type: 'AC Sleeper',
        departureTime: '21:00',
        arrivalTime: '06:00',
        duration: '9h 0m',
        price: 1200,
        rating: 4.5,
        seatsAvailable: 12,
    },
    {
        id: 2,
        name: 'Royal Cruiser',
        type: 'AC Seater',
        departureTime: '14:00',
        arrivalTime: '22:00',
        duration: '8h 0m',
        price: 800,
        rating: 4.0,
        seatsAvailable: 5,
    },
    {
        id: 3,
        name: 'Super Star Travels',
        type: 'Non-AC Sleeper',
        departureTime: '23:00',
        arrivalTime: '08:00',
        duration: '9h 0m',
        price: 500,
        rating: 3.5,
        seatsAvailable: 20,
    },
    {
        id: 4,
        name: 'City Bus',
        type: 'Non-AC Seater',
        departureTime: '08:00',
        arrivalTime: '16:00',
        duration: '8h 0m',
        price: 600,
        rating: 3.8,
        seatsAvailable: 10,
    },
];

export default TripBooking;
