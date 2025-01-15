import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Normal/Navbar';
import { Calendar, Clock, IndianRupee, MapPin, Star,Bus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaBusAlt, FaTag } from 'react-icons/fa';

const TripBooking = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate('')

    console.log(buses, 'buses');


    const searchParams = JSON.parse(localStorage.getItem('searchParams') || '{}');
    const from = searchParams.from || '';
    const to = searchParams.to || '';
    const date = searchParams.date || '';

    useEffect(() => {
        if (from && to && date) {
            const fetchBuses = async () => {
                setLoading(true);
                try {
                    const response = await axios.get('http://127.0.0.1:8000/search_buses/', {
                        params: {
                            from,
                            to,
                            date,
                        },
                    });
                    setBuses(response.data);
                    localStorage.setItem('buses', JSON.stringify(response.data));
                } catch (error) {
                    setError('Error fetching bus data');
                } finally {
                    setLoading(false);
                }
            };

            fetchBuses();
        }
    }, [from, to, date]);

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
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-6">
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
                                    {[{ label: "Morning (6 AM - 12 PM)", value: "morning" }, { label: "Afternoon (12 PM - 6 PM)", value: "afternoon" }, { label: "Night (6 PM - 6 AM)", value: "night" }].map((time) => (
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

                    <div className="md:col-span-3">
                        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Available Buses
                                </h2>
                                <div className="text-sm text-gray-600">
                                    {loading ? 'Loading buses...' : `${buses?.buses?.length || 0} buses found`}
                                </div>
                            </div>
                        </div>

                        {error && <div className="text-red-500">{error}</div>}

                        {/* <div className="space-y-4">
                            {Array.isArray(buses.buses) && buses.buses.length > 0 ? (
                                buses.buses.map((bus) => (
                                    <div
                                        key={bus.bus_number}
                                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">


                                            <div className="flex-1">
                                                {bus.bus_owner_logo ? (
                                                    <img
                                                        src={`http://127.0.0.1:8000/${bus.bus_owner_logo}`}
                                                        alt={`${bus.bus_owner_name} logo`}
                                                        className="mt-2 w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : null}
                                                <h3 className="text-lg font-semibold text-gray-800">{bus.bus_owner_name}</h3>
                                                <p className="text-sm text-gray-600">{bus.bus_type}</p>
                                            </div>

                                             
                                            <div className="flex-1">
                                                <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                                     
                                                    <span className="text-red-500">
                                                        <FaTag />
                                                    </span>
                                                    {bus.name}
                                                </p>
                                            </div>


                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium">{new Date(bus.scheduled_date).toLocaleString()}</p>
                                                        <p className="text-sm text-gray-500">Scheduled Date</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600">Seats Available: {bus.seat_count}</p>
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-5 h-5 text-yellow-400" />
                                                     
                                                </div>
                                            </div>

                                            <div className="flex-1 text-center">
                                                <p className="text-sm text-gray-600">Distance: </p>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-xl font-semibold text-gray-800">{bus.distance_km} km</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <IndianRupee className="w-5 h-5 text-gray-800" />
                                                    <span className="text-xl font-bold text-gray-800">
                                                        {bus.price}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/user-bus-view/${bus.id}`)}
                                                    className="mt-2 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors">
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-3">No buses available.</p>
                            )}
                        </div> */}


                        <div className="space-y-4">
                            {Array.isArray(buses.buses) && buses.buses.length > 0 ? (
                                buses.buses.map((bus) => (
                                    <div
                                        key={bus.bus_number}
                                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                                            {/* Bus Owner Section */}
                                            <div className="flex-1 flex items-center gap-3">
                                                {bus.bus_owner_logo ? (
                                                    <img
                                                        src={`http://127.0.0.1:8000/${bus.bus_owner_logo}`}
                                                        alt={`${bus.bus_owner_name} logo`}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : null}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">{bus.bus_owner_name}</h3>
                                                    <p className="text-sm text-gray-600">{bus.bus_type}</p>
                                                </div>
                                            </div>

                                            
                                            <div className="flex-1 flex items-center gap-2">
                                                <span className="text-red-500">
                                                    {/* <Bus className="w-5 h-5" /> */}
                                                </span>
                                                <p className="text-lg font-medium text-gray-800">{bus.name}</p>
                                            </div>

                                            {/* Scheduled Date Section */}
                                            <div className="flex-1 flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">{new Date(bus.scheduled_date).toLocaleString()}</p>
                                                    <p className="text-sm text-gray-500">Scheduled Date</p>
                                                </div>
                                            </div>

                                            {/* Seats Available Section */}
                                            <div className="flex-1 flex items-center gap-2">
                                                <p className="text-sm text-gray-600">Seats: {bus.seat_count}</p>
                                                <Star className="w-5 h-5 text-yellow-400" />
                                            </div>

                                            {/* Distance Section */}
                                            <div className="flex-1 text-center">
                                                <p className="text-sm text-gray-600">Distance:</p>
                                                <span className="text-xl font-semibold text-gray-800">{bus.distance_km} km</span>
                                            </div>

                                            {/* Price and Button Section */}
                                            <div className="flex-1 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <IndianRupee className="w-5 h-5 text-gray-800" />
                                                    <span className="text-xl font-bold text-gray-800">{bus.price}</span>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/user-bus-view/${bus.id}`)}
                                                    className="mt-2 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-3">No buses available.</p>
                            )}
                        </div>








                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripBooking;
