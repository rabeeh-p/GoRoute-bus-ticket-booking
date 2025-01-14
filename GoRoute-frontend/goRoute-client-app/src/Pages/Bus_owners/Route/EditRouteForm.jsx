import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditRouteForm = () => {
    const { routeId } = useParams();  
    const [route_name, setRouteName] = useState("");
    const [start_location, setStartLocation] = useState("");
    const [end_location, setEndLocation] = useState("");
    const [distance_in_km, setDistanceInKm] = useState("");
    const [start_datetime, setStartDatetime] = useState("");
    const navigate = useNavigate();
    console.log(route_name, 'namee');


    useEffect(() => {
        const fetchRouteDetails = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                Swal.fire({
                    icon: "warning",
                    title: "Session Expired",
                    text: "Please log in again.",
                });
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8000/routes/${routeId}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log(response.data, 'dataaa');

                const { route_name, start_location, end_location, distance_in_km, start_datetime } = response.data;
                const formatDatetime = (datetime) => {
                    const date = new Date(datetime);
                    return date.toISOString().slice(0, 16);
                };
                setRouteName(route_name);
                setStartLocation(start_location);
                setEndLocation(end_location);
                // setDistanceInKm(distance_in_km);
                setDistanceInKm(Math.floor(distance_in_km));
                setStartDatetime(formatDatetime(start_datetime));
            } catch (err) {
                console.error("Error fetching route details:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load route details. Please try again later.",
                });
            }
        };

        fetchRouteDetails();
    }, [routeId, navigate]);

    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!route_name || !start_location || !end_location || !distance_in_km || !start_datetime) {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please fill in all fields.",
            });
            return;
        }

        const textPattern = /^[A-Za-z\s]+$/;  

        if (!textPattern.test(route_name)) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Route Name",
                text: "Route name should only contain letters and spaces.",
            });
            return;
        }

        if (!textPattern.test(start_location)) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Start Location",
                text: "Start location should only contain letters and spaces.",
            });
            return;
        }

        if (!textPattern.test(end_location)) {
            Swal.fire({
                icon: "warning",
                title: "Invalid End Location",
                text: "End location should only contain letters and spaces.",
            });
            return;
        }

        const distancePattern = /^(?:[1-9][0-9]{2})$/;  
        if (distance_in_km && !distancePattern.test(distance_in_km)) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Distance",
                text: "Distance must be a 3-digit number between 100 and 999.",
            });
            return;
        }

        const parsedDate = new Date(start_datetime);
        if (isNaN(parsedDate.getTime())) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Date & Time",
                text: "Please select a valid start date and time.",
            });
            return;
        }

        const updatedRoute = {
            route_name,
            start_location,
            end_location,
            distance_in_km,
            start_datetime,
        };

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            Swal.fire({
                icon: "warning",
                title: "Session Expired",
                text: "Please log in again.",
            });
            navigate("/login");
            return;
        }

        try {
            await axios.put(
                `http://localhost:8000/routes/${routeId}/`,
                updatedRoute,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title: "Route Updated",
                text: "The route has been successfully updated!",
            });

            navigate("/busowner-dashboard/bus-owner/route-table");
        } catch (err) {
            console.error("Error updating route:", err);

            if (err.response && err.response.data) {
                const errorMessage = Object.values(err.response.data)
                    .flat()
                    .join(" ");
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMessage || "Failed to update route. Please try again later.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update route. Please try again later.",
                });
            }
        }
    };





    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-blue-600 mb-6">Edit Route</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="routeName" className="block text-lg font-medium text-gray-700 mb-2">
                            Route Name
                        </label>
                        <input
                            id="routeName"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={route_name}
                            onChange={(e) => setRouteName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="startLocation" className="block text-lg font-medium text-gray-700 mb-2">
                            Start Location
                        </label>
                        <input
                            id="startLocation"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={start_location}
                            onChange={(e) => setStartLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="endLocation" className="block text-lg font-medium text-gray-700 mb-2">
                            End Location
                        </label>
                        <input
                            id="endLocation"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={end_location}
                            onChange={(e) => setEndLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="distanceInKm" className="block text-lg font-medium text-gray-700 mb-2">
                            Distance (km)
                        </label>
                        {/* <input
              id="distanceInKm"
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={distance_in_km}
              onChange={(e) => setDistanceInKm(e.target.value)}
            /> */}
                        <input
                            id="distanceInKm"
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            // value={distance_in_km}
                            value={distance_in_km !== "" ? Math.floor(distance_in_km) : ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^[0-9]+$/.test(value)) {
                                    setDistanceInKm(value);
                                }
                            }}
                            min="100"  
                            max="999"  
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="startDatetime" className="block text-lg font-medium text-gray-700 mb-2">
                            Start Date & Time
                        </label>
                        <input
                            id="startDatetime"
                            type="datetime-local"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={start_datetime}
                            onChange={(e) => setStartDatetime(e.target.value)}
                            required
                        />

                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            Update Route
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRouteForm;
