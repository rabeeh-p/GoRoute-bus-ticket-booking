import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaPhoneAlt, FaCalendarAlt, FaUser, FaTransgender } from "react-icons/fa";
import axiosInstance from '../../../axios/axios';
import { useNavigate } from 'react-router-dom';

const ProfileDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  

  useEffect(() => {
    // const fetchUserProfile = async () => {
    //   const accessToken = localStorage.getItem('accessToken');  
  
    //   if (!accessToken) {
    //     navigate('/admin-login'); 
    //     return;
    //   }
  
    //   try {
    //     const response = await axiosInstance.get('api/profile/', {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,  
    //       },
    //     });
  
    //     console.log('User profile data:', response.data);  
    //     setUserDetails(response.data);  
    //   } catch (err) {
    //     if (err.response && err.response.status === 401) {
    //       localStorage.removeItem('accessToken');  
    //       localStorage.removeItem('refreshToken');  
    //       localStorage.removeItem('userType');  
  
    //       navigate('/login');  
    //       setError('Session expired. Please log in again.');
    //     } else {
    //       console.error('Error fetching user profile:', err.message || err);
    //       setError('Failed to fetch user profile');
    //     }
    //   } finally {
    //     setLoading(false);  
    //   }
    // };
  

    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
    
      if (!accessToken) {
        navigate('/login');  
        return;
      }
    
      try {
        const response = await axiosInstance.get('api/profile/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        console.log('User profile data:', response.data);
    
        if (response.data.deactivated) {

          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userType');
    
          navigate('/login');   
          setError('Your account is deactivated. Please contact support.');
          return;
        }
    
        setUserDetails(response.data);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userType');
            
            navigate('/login');
            setError('Session expired. Please log in again.');
          } else if (err.response.status === 403) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userType');
            
            navigate('/login');   
            setError('Your account is deactivated. Please contact support.');
          } else {
            setError('Failed to fetch user profile');
          }
        } else {
          console.error('Error fetching user profile:', err.message || err);
          setError('Failed to fetch user profile');
        }
      } finally {
        setLoading(false);  
      }
    };
    
    
    




    fetchUserProfile();
  }, [navigate]);
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2">
          <FaUserEdit />
          <span>Edit</span>
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-8 items-center">
        {/* Profile Picture */}
        <div className="flex justify-center sm:w-1/3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
            alt="Profile"
            className="rounded-full border-4 border-gray-200 w-36 h-36 object-cover shadow-md"
          />
        </div>

        {/* User Info */}
        <div className="sm:w-2/3 space-y-4">
          <div className="flex items-center space-x-3">
            <FaUser className="text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Username:</h3>
              <p className="text-gray-600">{userDetails.user || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaUser className="text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">First Name:</h3>
              <p className="text-gray-600">{userDetails.first_name || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaUser className="text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Last Name:</h3>
              <p className="text-gray-600">{userDetails.last_name || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaPhoneAlt className="text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Phone Number:</h3>
              <p className="text-gray-600">{userDetails.phone_number || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Date of Birth:</h3>
              <p className="text-gray-600">{userDetails.date_of_birth || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaTransgender className="text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Gender:</h3>
              <p className="text-gray-600 capitalize">{userDetails.gender || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
