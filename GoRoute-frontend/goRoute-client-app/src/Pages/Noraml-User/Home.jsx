import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Normal/Navbar';
import Features from '../../Components/Normal/Features';
import SearchForm from '../../Components/Normal/SearchForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [routes, setRoutes] = useState([]);
  const [uniqueRoutes, setUniqueRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // axios.get("http://127.0.0.1:8000/scheduled_buses/")
    axios.get("http://127.0.0.1:8000/scheduled_buses/")
      .then((response) => {
        const fetchedRoutes = response.data;

        const seenRoutes = new Set();
        const uniqueRoutes = fetchedRoutes.filter((route) => {
          const routeKey = `${route.first_stop.stop_name}-${route.last_stop.stop_name}-${route.scheduled_date.split('T')[0]}`;

          if (seenRoutes.has(routeKey)) {
            return false;   
          }

          seenRoutes.add(routeKey);   
          return true;
        });

        setRoutes(fetchedRoutes);
        setUniqueRoutes(uniqueRoutes);  
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the routes!", error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  

  const handleViewSchedule = (route) => {
    localStorage.setItem('searchParams', JSON.stringify({
      from: route.first_stop.stop_name, 
      to: route.last_stop.stop_name, 
      date: route.scheduled_date.split('T')[0]
    }));

    navigate('/trip-booking');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div 
        className="pt-24 pb-12 px-4 bg-gradient-to-r from-red-600 to-red-800"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80")',
          backgroundBlend: 'overlay',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book Bus Tickets Online
            </h1>
            <p className="text-xl">Travel safely and comfortably across the country</p>
          </div>
          <SearchForm />
        </div>
      </div>

      <Features />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Favorite Routes</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {uniqueRoutes.map((route, index) => {
            return (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Route: {route.first_stop.stop_name} to {route.last_stop.stop_name}
                </h3>

                <p className="text-gray-600 mt-2">
                  Scheduled for: {formatDate(route.scheduled_date)}
                </p>

                <button className="mt-3 text-red-600 hover:text-red-700"
                onClick={() => handleViewSchedule(route)}
                >
                  View Schedule →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
