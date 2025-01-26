import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../axios/axios';

const BDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setError('No access token found');
                return;
            }
    axiosInstance
      .get('http://127.0.0.1:8000/api/orders/',{ 
        headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data' 
        }
    })  
      .then((response) => {
        const transformedData = response.data.map((order) => ({
          name: order.from_city || 'Unknown',
          bookings: parseFloat(order.amount) || 0,  
        }));
        setData(transformedData);
      })
      .catch((error) => console.error('Error fetching order data:', error));
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff8f0', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#d32f2f', marginBottom: '20px' }}>RedBus Dashboard</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e6e6" />
          <XAxis dataKey="name" stroke="#d32f2f" />
          <YAxis stroke="#d32f2f" />
          <Tooltip contentStyle={{ backgroundColor: '#fff8f0', borderColor: '#d32f2f' }} />
          <Line type="monotone" dataKey="bookings" stroke="#d32f2f" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BDashboard;
