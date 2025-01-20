import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../Hook/useLogout';

const DashboardConductor = () => {
  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProfileClick = () => {
    setIsModalOpen(true);  
  };

  const handleEditProfileClick = () => {
    navigate('/conductor/profile/edit');  
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center bg-red-600 p-6 text-white">
        <h1 className="text-3xl font-semibold" onClick={()=>navigate('/conductor-home')}>Conductor Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-700 py-2 px-4 rounded-lg hover:bg-red-800 transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Conductor Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-red-600">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Conductor Profile</h2>
            <p className="text-gray-700 mb-4">View and manage your profile details.</p>

            <div className="flex justify-between items-center">
              <button
                onClick={handleViewProfileClick}
                className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
              >
                View Profile
              </button>
              <button
                onClick={handleEditProfileClick}
                className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Viewing Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg relative">
            <h3 className="text-2xl font-semibold text-red-600 mb-6">Conductor Profile</h3>
            <div className="space-y-4">
              {/* Sample Profile Information */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-800">John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">License Number:</span>
                <span className="text-gray-800">ABC12345</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Phone Number:</span>
                <span className="text-gray-800">+1234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-800">johndoe@example.com</span>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleCloseModal}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardConductor;
