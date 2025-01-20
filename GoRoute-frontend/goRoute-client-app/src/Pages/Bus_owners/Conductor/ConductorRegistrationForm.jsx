import React, { useState } from 'react';
import axiosInstance from '../../../axios/axios';
import Swal from 'sweetalert2';

const ConductorRegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        license_number: "",
        phone_number: "",
        hired_date: "",
        name: ''
    });

    const [responseMessage, setResponseMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Validate input fields
    // const validateForm = () => {
    //     const { username, password, license_number, phone_number, hired_date, name } = formData;

    //     // Check for empty fields or fields with spaces
    //     if (!username.trim() || !password.trim() || !license_number.trim() || !phone_number.trim() || !name.trim()) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Validation Error',
    //             text: 'Please fill in all the fields without leading/trailing spaces!',
    //         });
    //         return false;
    //     }

    //     // Validate phone number format (should be numeric)
    //     const phoneRegex = /^[0-9]{10}$/;
    //     if (!phoneRegex.test(phone_number)) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Invalid Phone Number',
    //             text: 'Phone number must be 10 digits.',
    //         });
    //         return false;
    //     }

    //     // Validate license number (if needed, add your own regex for the format)
    //     const licenseRegex = /^[A-Za-z0-9]+$/;  // Example: alphanumeric license numbers
    //     if (!licenseRegex.test(license_number)) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Invalid License Number',
    //             text: 'License number must be alphanumeric.',
    //         });
    //         return false;
    //     }

    //     return true;
    // };

    const validateForm = () => {
        const { username, password, license_number, phone_number, hired_date, name } = formData;
    
        // Check for empty fields or fields with spaces
        if (!username.trim() || !password.trim() || !license_number.trim() || !phone_number.trim() || !name.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all the fields without leading/trailing spaces!',
            });
            return false;
        }
    
        // Validate phone number format (should be numeric)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone_number)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number must be 10 digits.',
            });
            return false;
        }
    
        // Validate license number (if needed, add your own regex for the format)
        const licenseRegex = /^[A-Za-z0-9]+$/; // Example: alphanumeric license numbers
        if (!licenseRegex.test(license_number)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid License Number',
                text: 'License number must be alphanumeric.',
            });
            return false;
        }
    
        // Validate hired_date to ensure it is not in the future
        if (hired_date) {
            const selectedDate = new Date(hired_date);
            const today = new Date();
    
            // Set today's time to 00:00:00 to ensure only date comparison
            today.setHours(0, 0, 0, 0);
    
            if (selectedDate > today) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Hired Date',
                    text: 'Hired date cannot be in the future.',
                });
                return false;
            }
        }
    
        return true;
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;  

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Token Missing',
                    text: 'No access token found. Please login again.',
                });
                return;
            }

            const response = await axiosInstance.post("/register_conductor/", formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Conductor registered successfully!',
            });
            setFormData({
                username: "",
                password: "",
                license_number: "",
                phone_number: "",
                hired_date: "",
                name: ''
            });

        } catch (error) {
            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Registration Error',
                text: error.response?.data?.error || 'An error occurred during registration.',
            });
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Register a Conductor</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">License Number:</label>
                    <input
                        type="text"
                        name="license_number"
                        value={formData.license_number}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Phone Number:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Hired Date:</label>
                    <input
                        type="date"
                        name="hired_date"
                        value={formData.hired_date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Register Conductor
                </button>
            </form>
        </div>
    );
};

export default ConductorRegistrationForm;
