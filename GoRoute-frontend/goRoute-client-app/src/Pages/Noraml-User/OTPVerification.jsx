import React, { useState, useEffect } from 'react';
import { Lock, Phone } from 'lucide-react';  
import axios from 'axios';
import Navbar from '../../Components/Normal/Navbar';
import { useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  const navigate =useNavigate()

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData) {
      setUserData(storedData);  
    } else {
      setError('No registration data found. Please register first.');
    }
  }, []);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    if (!userData) {
      setError('User data is missing.');
      return;
    }

    try {
      const dataToSend = {
        ...userData,   
        otp: otp
      };

      const response = await axios.post('http://127.0.0.1:8000/otp/', dataToSend);
      console.log('Backend Response:', response.data);
      
      if (response.data.message === 'User registered successfully') {
        setIsVerified(true);
        setError('');  
        localStorage.removeItem('userData'); 
      } else {
        setError('Invalid OTP, please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);  
      } else {
        setError('Verification failed. Please try again later.');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mt-4">
            <div className="flex items-center justify-center">
              <Phone className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">OTP Verification</h2>
            <p className="mt-2 text-sm text-gray-600">Enter the OTP sent to your phone number</p>
          </div>

          {!isVerified ? (
            <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="otp"
                    required
                    maxLength="6"
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Verify OTP
              </button>
            </form>
          ) : (
            <div className="mt-8 text-center">
              <p className="text-xl font-semibold text-green-600">OTP Verified Successfully!</p>
              <button
                onClick={()=>{navigate('/login')}}
                className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
