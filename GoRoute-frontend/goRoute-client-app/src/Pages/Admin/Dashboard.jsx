import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [filterType, setFilterType] = useState('weekly');  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/scheduled-bus-data/?filter_type=${filterType}`);
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filterType]);   

  return (
    <div className="text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Admin Panel</h1>
      
     
      <div className="mb-6">
  <button 
    onClick={() => setFilterType('weekly')} 
    className="px-4 py-2 bg-red-600 text-white rounded mr-2"
  >
    Weekly
  </button>
  <button 
    onClick={() => setFilterType('monthly')} 
    className="px-4 py-2 bg-red-600 text-white rounded mr-2"
  >
    Monthly
  </button>
  <button 
    onClick={() => setFilterType('yearly')} 
    className="px-4 py-2 bg-red-600 text-white rounded"
  >
    Yearly
  </button>
</div>

      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Scheduled Bus Graph</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E5E5" />
            <XAxis dataKey="bus" tick={{ fill: '#333' }} />
            <YAxis tick={{ fill: '#333' }} />
            <Tooltip contentStyle={{ backgroundColor: '#E50914', color: '#fff' }} />
            <Legend />
            <Bar dataKey="seat_count" fill="#E50914" barSize={30} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
