import React, { useState } from 'react';
import axios from 'axios';

const OrdersTable = ({ orders }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleViewClick = async (order) => {
    setSelectedOrder(order);
    setLoading(true);
    setModalOpen(true);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/orders/${order.id}/details/`);
      
      setSelectedOrder(prevState => ({
        ...prevState,
        tickets: response.data.tickets,
      }));
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Booking Details</h2>

      {/* Check if there are no orders */}
      {orders.length === 0 ? (
        <p>No Booking available.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* Responsive Table */}
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleViewClick(order)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <p><strong>Name:</strong> {selectedOrder.name}</p>
            <p><strong>Email:</strong> {selectedOrder.email}</p>
            <p><strong>Order Date:</strong> {selectedOrder.created_at}</p>

            {/* Display ticket details */}
            <h4 className="mt-4 text-lg font-semibold">Tickets:</h4>
            {loading ? (
              <p>Loading ticket details...</p>
            ) : (
              <ul className="list-disc ml-6">
                {Array.isArray(selectedOrder.tickets) && selectedOrder.tickets.length > 0 ? (
                  selectedOrder.tickets.map((ticket, index) => (
                    <li key={index}>
                      <p><strong>Seat Number:</strong> {ticket.seat_number}</p>
                      <p><strong>Status:</strong> {ticket.ticket_status}</p>
                      <p><strong>Amount:</strong> ${ticket.ticket_amount}</p>
                    </li>
                  ))
                ) : (
                  <p>No tickets found for this order.</p>
                )}
              </ul>
            )}

            <button
              onClick={handleCloseModal}
              className="mt-4 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
