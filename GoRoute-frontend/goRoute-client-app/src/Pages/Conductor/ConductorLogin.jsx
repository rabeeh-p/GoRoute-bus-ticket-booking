import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';   
import { useNavigate } from 'react-router-dom';   
import { setUserType, setToken } from '../../slice/userSlicer';

const ConductorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();   
  const navigate = useNavigate();   


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Both fields are required.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/conductor/login/', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const { token, user_type } = response.data;

        if (token) {
          localStorage.setItem('accessToken', token);
          localStorage.setItem('userType', user_type);

          dispatch(setToken({ access: token }));
          dispatch(setUserType(user_type));

          if (user_type === 'conductor') {
            navigate('/conductor-home');   
          } else {
            navigate('/');   
          }
        } else {
          setError('Login failed: Token not found.');
        }
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);  
      } else {
        setError('Something went wrong. Please try again later.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-red-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-red-600 mb-6">Conductor Login</h2>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="username">
              Username (License Number)
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg focus:outline-none ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} transition duration-300`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConductorLogin;
