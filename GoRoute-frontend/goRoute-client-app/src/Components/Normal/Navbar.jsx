import React, { useEffect, useState } from 'react';
import { Bus, User, Search, Phone, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUserData } from '../../slice/userSlicer';

const Navbar = () => {
  const [userType, setUserType] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // State to toggle mobile menu
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);  // Set user type from localStorage
    }
  }, []);

  const handleLogout = () => {
    // Dispatch action to clear user data in Redux store
    dispatch(clearUserData());

    // Optionally, remove user data from localStorage
    localStorage.removeItem('userType');
    localStorage.removeItem('token');

    // Redirect to home or login page
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);  // Toggle the menu state
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2" onClick={() => navigate('/')}>
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
            {!userType ? (
              <>
                <button onClick={() => navigate('/login', { replace: true })} className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-red-600">
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </button>
                <button onClick={() => navigate('/signUp')} className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/profile-dashboard/user-dashboard')} className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                  Profile
                </button>
                <button onClick={handleLogout} className="hidden md:block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  Logout
                </button>
              </>
            )}
            <button className="md:hidden" onClick={toggleMenu}>
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full py-4 px-6">
          <a href="#" className="block text-gray-700 py-2">Home</a>
          <a href="#" className="block text-gray-700 py-2">Book Tickets</a>
          <a href="#" className="block text-gray-700 py-2">My Bookings</a>
          <a href="#" className="block text-gray-700 py-2">Contact Us</a>
          {!userType ? (
            <>
              <button onClick={() => navigate('/login', { replace: true })} className="block w-full text-gray-700 py-2">
                Login
              </button>
              <button onClick={() => navigate('/signUp')} className="block w-full bg-red-600 text-white py-2">
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/profile-dashboard/user-dashboard')} className="block w-full bg-red-600 text-white py-2">
                Profile
              </button>
              <button onClick={handleLogout} className="block w-full bg-gray-600 text-white py-2">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
