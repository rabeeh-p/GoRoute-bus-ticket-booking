import React from 'react';
import { Bus, User, Search, Phone, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">GoRoute</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-red-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-red-600">Book Tickets</a>
            <a href="#" className="text-gray-700 hover:text-red-600">My Bookings</a>
            <a href="#" className="text-gray-700 hover:text-red-600">Contact Us</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-red-600">
              <User className="h-5 w-5" />
              <span>Login</span>
            </button>
            <button className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Sign Up
            </button>
            <button className="md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;