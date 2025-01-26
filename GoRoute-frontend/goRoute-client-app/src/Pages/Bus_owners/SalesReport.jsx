import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import axiosInstance from '../../axios/axios';

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setError('No access token found');
            return;
        }
        const response = await axiosInstance.get('/api/orders/',{ 
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data' 
            }
        });  
        console.log('API response:', response.data);  

        if (Array.isArray(response.data)) {
          setSalesData(response.data);  
        } else {
          setError('Data is not in the expected format');
        }
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };
    fetchSalesData();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 16);
    
    const tableColumn = ["#", "Name", "Email", "Phone Number", "From City", "To City", "Date", "Amount", "Status"];
    const tableRows = salesData.map((item, index) => [
      index + 1,
      item.name,
      item.email || 'N/A',  
      item.phone_number || 'N/A',  
      item.from_city,
      item.to_city,
      item.date,
      item.amount,
      item.status,
    ]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [211, 47, 47] },  
      columnStyles: { 0: { halign: 'center' } },
    });

    doc.save('sales_report.pdf');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff8f0', minHeight: '100vh' }}>
      <div className="shadow-lg rounded-2xl border" style={{ backgroundColor: '#fff8f0' }}>
        <div className="p-4">
          <h1 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#d32f2f' }}>Sales Report</h1>
          <button 
            onClick={downloadPDF} 
            className="bg-red-500 text-white py-2 px-4 rounded mb-4"
            style={{ backgroundColor: '#d32f2f' }}
          >
            Download as PDF
          </button>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-red-100 text-left" style={{ backgroundColor: '#fce4ec' }}>
                  <th className="px-4 py-2 border border-gray-300">#</th>
                  <th className="px-4 py-2 border border-gray-300">Name</th>
                  <th className="px-4 py-2 border border-gray-300">Email</th>
                  <th className="px-4 py-2 border border-gray-300">Phone Number</th>
                  <th className="px-4 py-2 border border-gray-300">From City</th>
                  <th className="px-4 py-2 border border-gray-300">To City</th>
                  <th className="px-4 py-2 border border-gray-300">Date</th>
                  <th className="px-4 py-2 border border-gray-300">Amount</th>
                  <th className="px-4 py-2 border border-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(salesData) && salesData.length > 0 ? (
                  salesData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-red-50">
                      <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                      <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                      <td className="px-4 py-2 border border-gray-300">{item.email || 'N/A'}</td>
                      <td className="px-4 py-2 border border-gray-300">{item.phone_number || 'N/A'}</td>
                      <td className="px-4 py-2 border border-gray-300">{item.from_city}</td>
                      <td className="px-4 py-2 border border-gray-300">{item.to_city}</td>
                      <td className="px-4 py-2 border border-gray-300">{item.date}</td>
                      <td className="px-4 py-2 border border-gray-300">{item.amount}</td>
                      <td className="px-4 py-2 border border-gray-300">{item.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-2 border border-gray-300 text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
