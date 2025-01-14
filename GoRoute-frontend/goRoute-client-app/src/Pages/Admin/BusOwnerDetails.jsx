import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axios';
import Swal from 'sweetalert2';

const BusOwnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [busOwner, setBusOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/admin-login');
      return;
    }

    axiosInstance
      .get(`bus-owner-details/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setBusOwner(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/admin-login');
          setError('Session expired. Please log in again.');
        } else {
          setError('Error fetching bus owner details.');
        }
        setLoading(false);
      });
  }, [id, navigate]);

  const toggleApprovalStatus = () => {
    if (!busOwner) return;

    const updatedStatus = !busOwner.is_approved;

    Swal.fire({
      title: `Are you sure you want to ${updatedStatus ? 'approve' : 'disapprove'} this bus owner?`,
      text: "This action will update the owner's active status.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: updatedStatus ? '#3085d6' : '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: updatedStatus ? 'Yes, approve!' : 'Yes, disapprove!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .patch(
            `bus-owner-details/${id}/`,
            { is_approved: updatedStatus },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            }
          )
          .then(() => {
            
            setBusOwner((prevState) => ({
              ...prevState,
              is_approved: updatedStatus,
            }));
            Swal.fire(
              updatedStatus ? 'Approved!' : 'Disapproved!',
              `The bus owner has been ${updatedStatus ? 'approved' : 'disapproved'}.`,
              'success'
            );
          })
          .catch((err) => {
            console.error('Error updating approval status:', err);
            Swal.fire('Error', 'Failed to update the status. Please try again.', 'error');
          });
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!busOwner) {
    return <div>No bus owner details found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-semibold text-red-600 text-center mb-6">Bus Owner Details</h2>

      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 p-4">
          <h4 className="text-xl font-semibold text-gray-800">Travel Name: {busOwner.travel_name}</h4>
          <p className="text-gray-600 text-lg">Address: {busOwner.address}</p>
          <p className="text-gray-600 text-lg">Contact Number: {busOwner.contact_number}</p>
          <p className="text-gray-600 text-lg">
            Created Date: {new Date(busOwner.created_date).toLocaleString()}
          </p>
          <p className="text-gray-600 text-lg">
            Active Status: {busOwner.is_approved ? 'Active' : 'Inactive'}
          </p>
          <button
            onClick={toggleApprovalStatus}
            className={`mt-4 py-2 px-4 rounded-md text-white ${
              busOwner.is_approved ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'
            }`}
          >
            {busOwner.is_approved ? 'Set Inactive' : 'Set Active'}
          </button>
        </div>
        <div className="md:w-1/3 p-4 flex justify-center">
          <img
            src={busOwner.logo_image ? `http://127.0.0.1:8000${busOwner.logo_image}` : '/default-profile.jpg'}
            alt="Bus Owner Logo"
            className="w-32 h-32 rounded-full border-4 border-red-600 object-cover"
          />
        </div>
      </div>
      <div className="text-center mt-6">
        <button
          onClick={() => navigate(`/admin-home/edit-bus-owner/${id}`)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default BusOwnerDetails;
