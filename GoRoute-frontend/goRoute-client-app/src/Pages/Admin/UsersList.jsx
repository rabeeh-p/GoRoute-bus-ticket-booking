import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axios"; // Make sure this path matches your project structure

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/admin-login");
      return;
    }

    axiosInstance
      .get("user-profiles/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
        console.log(response, "data");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        if (err.response && err.response.status === 401) {
          console.log(err, "401");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/admin-login");
          setError("Session expired. Please log in again.");
        } else {
          setError("Failed to fetch user data");
        }
        setLoading(false);
      });
  }, [navigate]);

  const formatName = (firstName, lastName) => {
    const formatPart = (part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : "");
    return `${formatPart(firstName)} ${formatPart(lastName)}`.trim();
  };

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : "";
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-red-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">User Profiles</h2>
        </div>
        <div className="p-6">
          <button
            onClick={() => navigate("/admin-home/user-creating")}
            className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
          >
            Add User
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.user}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatName(user.first_name, user.last_name)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{capitalizeFirstLetter(user.gender) || "Male"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/admin-home/user-details/${user.user}`)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition duration-300"
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
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl">
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-red-600 h-16"></div>
      <div className="p-6">
        <div className="h-10 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="container mx-auto px-4 py-8 max-w-4xl">
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-red-600">
      <div className="bg-red-600 text-white px-6 py-4">
        <h2 className="text-2xl font-bold">Error</h2>
      </div>
      <div className="p-6">
        <p className="text-center text-red-600">{message}</p>
      </div>
    </div>
  </div>
);

export default UsersList;
