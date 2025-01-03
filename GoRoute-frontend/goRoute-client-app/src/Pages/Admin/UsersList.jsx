import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios/axios';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  console.log(users,'users');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');  

    if (!accessToken) {
      navigate('/admin-login');  
      return;
    }

    axiosInstance.get('user-profiles/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,   
      },
    })
      .then(response => {
        setUsers(response.data);
        
        
        setLoading(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('accessToken');  
          localStorage.removeItem('refreshToken');  

          navigate('/admin-login');

          setError('Session expired. Please log in again.');
        } else {
          setError('Failed to fetch user data');
        }
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">User Profiles</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Profile</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Username</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.profile_picture ? (
                     <img
                     src={`http://127.0.0.1:8000${user.profile_picture}`} 
                     alt="Profile"
                     className="w-12 h-12 rounded-full"
                   />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white">No Image</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.first_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.gender}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => navigate(`/admin-home/user-details/${user.user}`)} 
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
