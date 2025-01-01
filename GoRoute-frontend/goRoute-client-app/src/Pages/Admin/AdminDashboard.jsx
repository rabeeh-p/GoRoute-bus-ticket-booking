import { Bus } from 'lucide-react';
import React from 'react'
import { FaBus } from 'react-icons/fa';
const AdminDashboard = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-gradient-to-r from-red-600 to-red-800 text-white py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
                    <div className="flex items-center space-x-2">
                        <FaBus className="h-8 w-8 text-white" />  
                        <span className="text-2xl font-bold text-white">GoRoute</span>  
                    </div>
                    <div>
                        <button className="bg-white text-red-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                 
                <aside className="w-64 bg-gradient-to-r from-red-600 to-red-800 text-white">
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold">Admin Panel</h2>
                    </div>
                    <nav className="mt-6">
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="#dashboard"
                                    className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#users-list"
                                    className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                                >
                                    Users List
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#bus-owner-request"
                                    className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                                >
                                    Bus Owner Request
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#wallet"
                                    className="block py-2 px-4 hover:bg-red-700 rounded-lg transition duration-300"
                                >
                                    Wallet
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                 
                <main className="flex-1 p-6">
                    <div className="text-gray-800">
                        <h1 className="text-3xl font-bold mb-6">Welcome to the Admin Panel</h1>
                        <p className="text-lg">
                            Use the sidebar to navigate through the different sections of the admin panel.
                        </p>

                        
                        <section id="dashboard" className="mt-10">
                            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                    <h3 className="text-xl font-semibold">Total Users</h3>
                                    <p className="text-gray-600 mt-2 text-lg">1,234</p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                    <h3 className="text-xl font-semibold">Total Buses</h3>
                                    <p className="text-gray-600 mt-2 text-lg">567</p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                    <h3 className="text-xl font-semibold">Pending Requests</h3>
                                    <p className="text-gray-600 mt-2 text-lg">12</p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                    <h3 className="text-xl font-semibold">Total Earnings</h3>
                                    <p className="text-gray-600 mt-2 text-lg">$45,678</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard
