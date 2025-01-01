import { Bus } from 'lucide-react';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUserData } from '../../slice/userSlicer';


const BusOwner_Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = () => {
    dispatch(clearUserData());
  
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
  
      navigate("/");
    };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
  <header className="bg-red-600 text-white py-4 sticky top-0 z-10 shadow-md">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
      <div className="flex items-center space-x-2">
        <Bus className="h-8 w-8 text-white" />
        <span className="text-2xl font-bold text-white">GoRoute</span>
      </div>
      <div>
        <button
        onClick={handleLogout}
          className="bg-white text-red-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300"
        >
          Logout1
        </button>
      </div>
    </div>
  </header>

  <div className="flex flex-1">
    {/* Sidebar */}
    <aside className="w-64 bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white">
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Bus Owner Dashboard</h2>
      </div>
      <nav className="mt-6">
        <ul className="space-y-4">
          <li>
            <a
              href="#bus-list"
              className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
            >
              Bus List
            </a>
          </li>
          <li>
            <a
              href="#add-bus"
              className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
            >
              Add Bus
            </a>
          </li>
          <li>
            <a
              href="#add-route"
              className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
            >
              Add Route
            </a>
          </li>
          <li>
            <a
              href="#route-stops"
              className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
            >
              Route Stops
            </a>
          </li>
          <li>
            <a
              href="#careers"
              className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
            >
              Careers
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-6">
      <div className="text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Bus Owner Dashboard</h1>
        <p className="text-lg">
          Use the sidebar to manage your buses, routes, and job opportunities.
        </p>

        {/* Bus List Section */}
        <section id="bus-list" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Bus List</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Here you can view all your registered buses.</p>
          </div>
        </section>

        {/* Add Bus Section */}
        <section id="add-bus" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Add New Bus</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Bus Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter bus name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Bus Number</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter bus number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Capacity</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter capacity"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Add Bus
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Add Route Section */}
        <section id="add-route" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Add Route</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Route Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter route name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Starting Point</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter starting point"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Destination</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter destination"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Add Route
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Route Stops Section */}
        <section id="route-stops" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Route Stops</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Manage the stops for your routes here.</p>
          </div>
        </section>

        {/* Careers Section */}
        <section id="careers" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Careers</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Post job opportunities for bus drivers and staff here.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</div>

  );
}

export default BusOwner_Home
