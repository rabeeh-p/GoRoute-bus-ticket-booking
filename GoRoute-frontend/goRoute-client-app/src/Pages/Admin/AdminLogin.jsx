import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUserType } from "../../slice/userSlicer";  
import axios from "axios";

const AdminLogin = () => {
    
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch(); 

  const handleSubmit = async (e) => {
    e.preventDefault();  

    try {
      const response = await axios.post("http://127.0.0.1:8000/admin-login/", {
        username,  
        password,
      });


      const { access, refresh, user_type } = response.data;
      
      

      dispatch(setToken({ token: access })); 
      dispatch(setUserType(user_type));  

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userType", user_type);

      if (user_type === "super_admin") {
        window.location.href = "admin-home/dashboard";  
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition duration-300"
            >
              Login
            </button>
          </div>

           
        </form>

         
      </div>
    </div>
  );
};

export default AdminLogin;
