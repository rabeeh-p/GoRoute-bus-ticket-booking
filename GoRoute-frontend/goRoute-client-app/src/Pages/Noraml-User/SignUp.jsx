import React, { useState } from 'react';
import { Bus, Mail, Lock, User, Phone, Calendar } from 'lucide-react';
import Navbar from '../../Components/Normal/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        gender: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const validations = {
        username: value => value.trim().length >= 3 || "Username must be at least 3 characters.",
        first_name: value => value.trim().length >= 2 || "First name must be at least 2 characters.",
        last_name: value => value.trim().length >= 1 || "Last name must be at least 2 characters.",
        email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Enter a valid email address.",
        phone_number: value => /^\d{10}$/.test(value) || "Phone number must be a 10-digit number.",
        date_of_birth: value => {
            if (!value) {
                return "Date of birth is required.";
            }
            const enteredDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - enteredDate.getFullYear();
            const isBirthdayPassed = today.getMonth() > enteredDate.getMonth() ||
                                     (today.getMonth() === enteredDate.getMonth() && today.getDate() >= enteredDate.getDate());
        
            return (age > 18 || (age === 18 && isBirthdayPassed)) || "You must be at least 18 years old.";
        },
        gender: value => !!value || "Gender is required.",
        password: value => value.trim().length >= 5 || "Password must be at least 5 characters.",
        confirmPassword: value => value === formData.password || "Passwords do not match."
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const validate = validations[key];
            if (validate) {
                const result = validate(formData[key]);
                if (result !== true) {
                    newErrors[key] = result;
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!validateForm()) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Validation Error',
    //             text: 'Please fix the errors before submitting.',
    //         });
    //         return;
    //     }

    //     const { confirmPassword, ...dataToSend } = formData;

    //     try {
    //         const response = await axios.post('http://127.0.0.1:8000/register/', dataToSend);
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Registration Successful',
    //             text: 'You have successfully registered. Redirecting to OTP verification...',
    //             timer: 2000,
    //             showConfirmButton: false
    //         });

    //         localStorage.setItem('userData', JSON.stringify(dataToSend));
    //         setTimeout(() => navigate('/otp'), 2000);
    //     } catch (error) {
    //         console.error('Error during registration:', error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Registration Failed',
    //             text: 'An error occurred during registration. Please try again later.',
    //         });
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

    
        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fix the errors before submitting.',
            });
            return;
        }
    
        const { confirmPassword, ...dataToSend } = formData;
    
        // Show loading alert
        Swal.fire({
            title: 'Registering...',
            text: 'Please wait while we process your registration.',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', dataToSend);
    
            // Close loading alert and show success message
            Swal.close();  // Close loading
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'You have successfully registered. Redirecting to OTP verification...',
                timer: 2000,
                showConfirmButton: false
            });
    
            localStorage.setItem('userData', JSON.stringify(dataToSend));
            setTimeout(() => navigate('/otp'), 2000);
        } catch (error) {
            // Close loading alert and show error message
            Swal.close();  // Close loading
            console.error('Error during registration:', error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'An error occurred during registration. Please try again later.',
            });
        }
    };




    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="text-center mt-4">
                        <div className="flex items-center justify-center">
                            <Bus className="h-12 w-12 text-red-600" />
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join millions of happy travelers
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            {Object.keys(formData).map(field => (
                                <div key={field} className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {
                                            {
                                                username: <User className="h-5 w-5 text-gray-400" />,
                                                first_name: <User className="h-5 w-5 text-gray-400" />,
                                                last_name: <User className="h-5 w-5 text-gray-400" />,
                                                email: <Mail className="h-5 w-5 text-gray-400" />,
                                                phone_number: <Phone className="h-5 w-5 text-gray-400" />,
                                                date_of_birth: <Calendar className="h-5 w-5 text-gray-400" />,
                                                gender: (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-gray-400"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 2a8 8 0 10-8 8 8 8 0 008-8zm0 14a6 6 0 100-12 6 6 0 000 12z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ),
                                                password: <Lock className="h-5 w-5 text-gray-400" />,
                                                confirmPassword: <Lock className="h-5 w-5 text-gray-400" />
                                            }[field]
                                        }
                                    </div>
                                    {field === 'date_of_birth' ? (
                                        <input
                                            type="date"
                                            name={field}
                                            required
                                            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                            value={formData[field]}
                                            onChange={handleChange}
                                        />
                                    ) : field !== 'gender' ? (
                                        <input
                                            type={field.includes('password') ? 'password' : 'text'}
                                            name={field}
                                            required
                                            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                            placeholder={
                                                field
                                                    .replace(/_/g, ' ')
                                                    .replace(/\b\w/g, char => char.toUpperCase())
                                            }
                                            value={formData[field]}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <select
                                            name={field}
                                            required
                                            className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                            value={formData[field]}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>
                                                Select Gender
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    )}
                                    {errors[field] && (
                                        <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Sign up
                        </button>
                        <button
                            onClick={() => navigate('/b-signup')}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Bus owner
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
