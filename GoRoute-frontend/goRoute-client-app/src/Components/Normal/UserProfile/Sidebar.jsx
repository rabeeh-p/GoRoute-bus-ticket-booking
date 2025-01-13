import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaTicketAlt, FaWallet, FaCog, FaHistory, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { clearUserData } from '../../../slice/userSlicer';

const menuItems = [
  { icon: FaUser, text: 'Profile', path: '/profile-dashboard/profile' },
  { icon: FaTicketAlt, text: 'My Tickets', path: '/profile-dashboard/orders'  },
  { icon: FaWallet, text: 'trip-booking',path: '/trip-booking'  },
  { icon: FaWallet, text: 'Wallet' },
  { icon: FaHistory, text: 'Travel History' },
  { icon: FaSignOutAlt, text: 'Logout', path: '#', action: 'logout' },
];




export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()


  const handleMenuClick = (item) => {
    if (item.action === 'logout') {
      dispatch(clearUserData());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userType");
      navigate('/login')
    } else {
    }
  };



  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-red-500 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64`}>
        <div className="p-5">
          <div className="flex items-center justify-center mb-8" onClick={()=>navigate('/profile-dashboard/user-dashboard')}>
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
              alt="Profile"
              className="rounded-full w-20 h-20 border-4 border-red-500"
            />
          </div>
          <h2 className="text-xl font-bold text-center text-red-500 mb-8">John Doe</h2>
          <nav>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} className="mb-2" onClick={() => handleMenuClick(item)}>
                  <Link
                    to={item.path}
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3" />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
