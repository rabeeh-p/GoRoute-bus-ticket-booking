import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axiosInstance from "../../axios/axios";
import useLogout from '../../Hook/useLogout';

const BusDetail = ({ busId }) => {
  const [busDetail, setBusDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log(busDetail,'details');
  const { handleLogout } = useLogout();
  

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchBusDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/bus/${busId}/`);
        setBusDetail(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleLogout();  
        } else {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetail();
  }, [busId, navigate]);

  const handleDelete = async () => {
    // SweetAlert2 confirmation popup
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/bus/${busId}/`,{ 
          headers: { 
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data' 
          }
      });
        Swal.fire(
          'Deleted!',
          'Your bus has been deleted.',
          'success'
        );
        navigate("/busowner-dashboard/busowner-dashboard2");  
      } catch (err) {
        setError("Failed to delete the bus.");
        Swal.fire(
          'Error!',
          'There was an issue deleting the bus.',
          'error'
        );
      }
    }
  };

  const handleDocumentView = () => {
    if (busDetail.bus_document) {
      window.open(`http://127.0.0.1:8000/${busDetail.bus_document}`, "_blank");
    } else {
      Swal.fire(
        'No Document!',
        'There is no document available for this bus.',
        'info'
      );
    }
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  if (!busDetail) {
    return <div className="text-center text-lg text-gray-600">No bus details available.</div>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate("/busowner-dashboard/busowner-dashboard2")}  
        className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
      >
        Close
      </button>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{busDetail.name}</h2>
      <div className="mb-4">
        <strong>Bus Type: </strong>{busDetail.bus_type.name}
      </div>
      <div className="mb-4">
        <strong>Seat Count: </strong>{busDetail.bus_type.seat_count}
      </div>
      <div className="mb-4">
        <strong>Description: </strong>{busDetail.description || "No description available."}
      </div>

      <button
        onClick={handleDocumentView}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-4"
      >
        View Document
      </button>

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 mt-4"
      >
        Delete Bus
      </button>
    </div>
  );
};

export default BusDetail;
