import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axios';
import { useNavigate } from 'react-router-dom';

const RequestBusOwner = () => {
  const [busOwners, setBusOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const navigate = useNavigate();
  console.log(busOwners,'busowner idddd issue')

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/admin-login');
      return;
    }

    axiosInstance
      .get('bus-owner-requests/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setBusOwners(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching bus owner requests.');
        setLoading(false);
      });
  }, [navigate]);

  const handleAccept = (ownerId) => {
    console.log(ownerId,'iddddd');
    
    setSelectedOwner(ownerId);
    setShowConfirmModal(true);
  };

  const confirmAccept = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/admin-login');
      return;
    }

    axiosInstance
      .post(
        `accept-bus-owner/${selectedOwner}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setBusOwners((prevOwners) =>
          prevOwners.filter((owner) => owner.user !== selectedOwner)
        );
        setShowConfirmModal(false);
      })
      .catch((error) => {
        setError('Error accepting bus owner.');
        setShowConfirmModal(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (busOwners.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-3xl font-semibold text-center mb-6">Bus Owners Request</h2>
        <div className="text-center text-gray-500 text-lg">No bus owners found.</div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-3xl font-semibold text-red-600 text-center mb-6">
          Bus Owners Requests
        </h2>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Logo</th>
              <th className="px-4 py-2 border">Travel Name</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Created Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {busOwners.map((owner) => (
              <tr key={owner.id}>
                <td className="px-4 py-2 border">
                  <img
                    src={owner.logo_image ? `http://127.0.0.1:8000${owner.logo_image}` : '/default-logo.jpg'}
                    alt="Logo"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </td>
                <td className="px-4 py-2 border">{owner.travel_name}</td>
                <td className="px-4 py-2 border">{owner.contact_number}</td>
                <td className="px-4 py-2 border">{new Date(owner.created_date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleAccept(owner.user)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Accept
                  </button>
                  <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={()=>navigate(`/admin-home/busowner-details/${owner.user}`)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold">Confirm Acceptance</h3>
              <p>Are you sure you want to accept this bus owner request?</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAccept}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestBusOwner;
