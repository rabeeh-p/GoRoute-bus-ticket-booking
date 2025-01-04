import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Normal/Navbar";

const BusOwnerSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    travelName: "",
    address: "",
    contactNumber: "",
    logoImage: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      logoImage: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (/\s/.test(formData.username)) {
      newErrors.username = "Username cannot contain spaces.";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Confirm Password
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Travel Name
    if (!formData.travelName.trim()) {
      newErrors.travelName = "Travel name is required.";
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    // Contact Number
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required.";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Enter a valid 10-digit contact number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const payload = {
      user: {
        username: formData.username,
        password: formData.password,
        role: "bus_owner",
        email: formData.email,
      },
      bus_owner: {
        travel_name: formData.travelName,
        address: formData.address,
        contact_number: formData.contactNumber,
      },
    };

    console.log(formData.logoImage,'logo imggggggggggggggggg');
    
  
    if (formData.logoImage) {
      const formDataWithLogo = new FormData();
      formDataWithLogo.append("user.username", formData.username);
      formDataWithLogo.append("user.password", formData.password);
      formDataWithLogo.append("user.role", "bus_owner");
      formDataWithLogo.append("user.email", formData.email);
      formDataWithLogo.append("bus_owner.travel_name", formData.travelName);
      formDataWithLogo.append("bus_owner.address", formData.address);
      formDataWithLogo.append("bus_owner.contact_number", formData.contactNumber);
      formDataWithLogo.append("bus_owner.logo_image", formData.logoImage);
  

      
      try {
        setLoading(true);
        const response = await axios.post(
          "http://127.0.0.1:8000/bus_owner/register/",
          formDataWithLogo,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        if (response.status === 201) {
          setSuccessMessage("Registration successful!");
          setErrors({});
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            travelName: "",
            address: "",
            contactNumber: "",
            logoImage: null,
          });
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        setErrors({
          general:
            error.response?.status === 400
              ? "Invalid data provided."
              : "Registration failed. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://127.0.0.1:8000/bus_owner/register/",
          payload
        );
  
        if (response.status === 201) {
          setSuccessMessage("Registration successful!");
          setErrors({});
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            travelName: "",
            address: "",
            contactNumber: "",
            logoImage: null,
          });
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        setErrors({
          general:
            error.response?.status === 400
              ? "Invalid data provided."
              : "Registration failed. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bus Owner Registration
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="text-red-500 text-sm">{errors.general}</div>
              )}
              {successMessage && (
                <div className="text-green-500 text-sm">{successMessage}</div>
              )}

              {/* Unified Form Fields */}
              <div className="space-y-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}

                <input
                  type="text"
                  name="travelName"
                  placeholder="Travel Name"
                  value={formData.travelName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.travelName && (
                  <p className="text-red-500 text-sm">{errors.travelName}</p>
                )}

                <textarea
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}

                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.contactNumber}
                  </p>
                )}

                {/* <input
                  type="file"
                  name="logo_image"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                /> */}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Register
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    </>

  );
};

export default BusOwnerSignup;
