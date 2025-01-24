import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axios/axios';
import Swal from 'sweetalert2';  

const EditBusOwnerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [busOwner, setBusOwner] = useState({
    travel_name: '',
    address: '',
    contact_number: '',
    user: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/admin-login');
      return;
    }

    axiosInstance.get(`bus-owner-details/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        setBusOwner(response.data);
        setLoading(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/admin-login');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error fetching bus owner details.',
          });
        }
        setLoading(false);
      });
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusOwner((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!busOwner.travel_name.trim()) errors.push('Travel name is required.');
    if (!busOwner.address.trim()) errors.push('Address is required.');
    if (!busOwner.contact_number.trim()) errors.push('Contact number is required.');

    if (busOwner.contact_number && !/^\d{10}$/.test(busOwner.contact_number)) {
      errors.push('Contact number must be a 10-digit number.');
    }

    if (errors.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: errors.join(' '),
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const accessToken = localStorage.getItem('accessToken');

    axiosInstance.put(`bus-owner-details/${id}/`, busOwner, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      },
    })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Bus owner details updated successfully.',
        }).then(() => {
          navigate(`/admin-home/busowner-details/${id}`);
        });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error updating bus owner details.',
        });
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-semibold text-red-600 text-center mb-6">Edit Bus Owner Details</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="travel_name" className="block text-lg font-medium text-gray-700">Travel Name</label>
          <input
            type="text"
            id="travel_name"
            name="travel_name"
            value={busOwner.travel_name}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-lg font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={busOwner.address}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contact_number" className="block text-lg font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            id="contact_number"
            name="contact_number"
            value={busOwner.contact_number}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBusOwnerForm;
