import React, { useState, useEffect } from "react"
import axiosInstance from "../../axios/axios"
import { useNavigate } from "react-router-dom"

const BusOwnersList = () => {
  const [busOwners, setBusOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      navigate("/admin-login")
      return
    }

    axiosInstance
      .get("approved-bus-owners/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setBusOwners(response.data)
        setLoading(false)
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("accessToken")
          navigate("/admin-login")
        } else {
          setError("Failed to fetch bus owner data")
        }
        setLoading(false)
      })
  }, [navigate])

  const handleViewClick = (ownerId) => {
    navigate(`/admin-home/busowner-details/${ownerId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-10">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">Bus Owners List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Profile</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Travel Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {busOwners.map((owner, index) => (
              <tr key={owner.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <img
                    src={`http://127.0.0.1:8000${owner.logo_image || "/default-logo.jpg"}`}
                    alt={owner.travel_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{owner.travel_name}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleViewClick(owner.user)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 text-xs sm:text-sm"
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
  )
}

export default BusOwnersList

