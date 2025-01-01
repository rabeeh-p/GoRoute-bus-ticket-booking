import React from 'react'

const AdminLogin = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Login to Your Account
            </h2>
            <form>
              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
    
              {/* Password Input */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
    
              {/* Submit Button */}
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition duration-300"
                >
                  Login
                </button>
              </div>
    
              {/* Forgot Password */}
              <div className="text-center">
                <a
                  href="#"
                  className="text-red-600 hover:underline text-sm"
                >
                  Forgot your password?
                </a>
              </div>
            </form>
    
            {/* Divider */}
            <div className="mt-6 border-t pt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-red-600 hover:underline">
                Sign up here
              </a>
            </div>
          </div>
        </div>
      );
}

export default AdminLogin
