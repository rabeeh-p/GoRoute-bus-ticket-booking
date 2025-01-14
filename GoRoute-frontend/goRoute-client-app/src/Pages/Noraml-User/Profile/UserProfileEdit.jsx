import React, { useState, useEffect } from 'react';
import axiosInstance from './../../../axios/axios';   
import { useNavigate } from 'react-router-dom';  
import { FaUserEdit, FaUser, FaPhoneAlt, FaCalendarAlt, FaTransgender } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UserProfileEdit = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    user: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    gender: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    axiosInstance.get('api/profile/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then(response => {
      setUserDetails(response.data);
      console.log(response.data, 'data edit page');
      
      setLoading(false);
    })
    .catch(err => {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setError('Failed to fetch user data');
      }
      setLoading(false);
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (userDetails.first_name.trim() === '' || userDetails.last_name.trim() === '' || userDetails.phone_number.trim() === '' || userDetails.date_of_birth.trim() === '' || userDetails.gender.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'All fields must be filled out and cannot contain only spaces.',
      });
      return false;
    }

    if (userDetails.phone_number && !phoneRegex.test(userDetails.phone_number)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Phone Number should contain exactly 10 digits.',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    axiosInstance.patch('user-profile/edit/', userDetails, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile details have been updated.',
      });
      navigate('/profile-dashboard/profile');
    })
    .catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update profile.',
      });
      setError('Failed to update user profile');
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Edit Profile</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2">
          <FaUserEdit />
          <span>Edit</span>
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-8 items-center">
          {/* Profile Picture */}
          <div className="flex justify-center sm:w-1/3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
              alt="Profile"
              className="rounded-full border-4 border-gray-200 w-36 h-36 object-cover shadow-md"
            />
          </div>

          <div className="sm:w-2/3 space-y-4">
            {/* First Name */}
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-500" />
              <div className="w-full">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={userDetails.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-500" />
              <div className="w-full">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={userDetails.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center space-x-3">
              <FaPhoneAlt className="text-gray-500" />
              <div className="w-full">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={userDetails.phone_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-gray-500" />
              <div className="w-full">
                <label className="block text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={userDetails.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center space-x-3">
              <FaTransgender className="text-gray-500" />
              <div className="w-full">
                <label className="block text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={userDetails.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileEdit;
