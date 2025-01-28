import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordUser = () => {
  const [step, setStep] = useState(1);  
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');  
  const [error, setError] = useState('');   
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 5) {
      return 'Password must be at least 5 characters long.';
    }
    if (/\s/.test(password)) {
      return 'Password cannot contain spaces.';
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'Password must contain both letters and numbers.';
    }
    return '';   
  };

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
      const response = await axios.post('http://127.0.0.1:8000/forgot-password-check-user/', { username });

      if (response.status === 200) {
        setUserType(response.data.userType);
        setStep(2);  
      } else {
        setError('Username not found.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);  
      } else {
        setError('Something went wrong. Please try again later.');
      }
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

    // Validate the password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/forgot-password-update/user/', {
        username,
        new_password: newPassword,
        user_type: userType,   
      });

      if (response.status === 200) {
        setSuccess('Password updated successfully.');
        setTimeout(() => {
          navigate('/login');   
        }, 2000);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);  
      } else {
        setError('Something went wrong. Please try again later.');
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
            <button
              type="button"
              onClick={() => navigate('/login')}  
              className="w-full py-2 text-white font-semibold rounded-lg mt-2 bg-gray-600 hover:bg-gray-700 transition duration-300"
            >
              Back to login
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

export default ForgotPasswordUser;
