import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../axios/axios';
import SalesReport from './SalesReport';

const BDashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('weekly');  

  const filterData = (data, filter) => {
    const now = new Date();
    let startDate;

    switch (filter) {
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7));  
        break;
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 1));  
        break;
      case 'yearly':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));  
        break;
      default:
        startDate = now;
        break;
    }

    return data.filter((order) => {
      const orderDate = new Date(order.date);  
      return orderDate >= startDate;
    });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return;
    }
    axiosInstance
      .get('http://127.0.0.1:8000/api/orders/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const transformedData = response.data.map((order) => ({
          name: order.from_city || 'Unknown',
          bookings: parseFloat(order.amount) || 0,
          date: order.date,  
        }));

        const filteredData = filterData(transformedData, filter);
        setData(transformedData);
        setFilteredData(filteredData);
      })
      .catch((error) => console.error('Error fetching order data:', error));
  }, [filter]);  

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <>
      <div style={{ padding: '20px', backgroundColor: '#fff8f0', minHeight: '100vh' }}>
        <h1 style={{ textAlign: 'center', color: '#d32f2f', marginBottom: '10px' }}> Dashboard</h1>

        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => handleFilterChange('weekly')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: filter === 'weekly' ? '#d32f2f' : '#ccc',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Weekly
          </button>
          <button
            onClick={() => handleFilterChange('monthly')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: filter === 'monthly' ? '#d32f2f' : '#ccc',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => handleFilterChange('yearly')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: filter === 'yearly' ? '#d32f2f' : '#ccc',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Yearly
          </button>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e6e6" />
            <XAxis dataKey="name" stroke="#d32f2f" />
            <YAxis stroke="#d32f2f" />
            <Tooltip contentStyle={{ backgroundColor: '#fff8f0', borderColor: '#d32f2f' }} />
            <Line type="monotone" dataKey="bookings" stroke="#d32f2f" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <div style={{ marginTop: '10px' }}>
          <SalesReport />
        </div>
      </div>
    </>
  );
};

export default BDashboard;
