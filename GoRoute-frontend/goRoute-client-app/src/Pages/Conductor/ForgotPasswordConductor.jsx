import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordConductor = () => {
  const [step, setStep] = useState(1);  
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username) {
      setError('Username is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/forgot-password-check/', { username });

      if (response.status === 200) {
        setStep(2);   
      } else {
        setError(response.data.error || 'Username not found.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/forgot-password-update/', {
        username,
        new_password: newPassword,
        confirm_password: confirmPassword,   
      });
  
      if (response.status === 200) {
        setSuccess(response.data.message || 'Password updated successfully.');
        setTimeout(() => {
          navigate('/conductor-login');   
        }, 2000);
      } else {
        setError(response.data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      if (err.response?.data?.confirm_password) {
        setError(err.response.data.confirm_password[0]);   
      } else {
        setError(err.response?.data?.error || 'Something went wrong. Please try again later.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex justify-center items-center bg-red-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-red-600 mb-6">
          Forgot Password
        </h2>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-center">{success}</div>}

        {step === 1 && (
          <form onSubmit={handleUsernameSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-semibold rounded-lg focus:outline-none ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} transition duration-300`}
            >
              {loading ? 'Checking...' : 'Submit'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="new-password">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-semibold rounded-lg focus:outline-none ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} transition duration-300`}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordConductor;
