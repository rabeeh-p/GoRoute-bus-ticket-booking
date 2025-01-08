import React from 'react'
import Navbar from '../../Components/Normal/Navbar'
import Features from '../../Components/Normal/Features'
import SearchForm from '../../Components/Normal/SearchForm'

const Home = () => {
    console.log('hello');

    // let user = localStorage.getItem('userType');
    // const userType = useSelector((state) => state.user.userType);
    // console.log(userType,'usert type protect');
    
  return (
    <div className="min-h-screen bg-gray-100">
    <Navbar />
    
    
    {/* Hero Section */}
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
          {/* <h1>{userType}user hello</h1> */}
          <p className="text-xl">
            Travel safely and comfortably across the country
          </p>
        </div>
        <SearchForm />
      </div>
    </div>

    {/* Features Section */}
    <Features />

    {/* Popular Routes Section */}
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Popular Routes</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          "New York - Boston",
          "Los Angeles - San Francisco",
          "Chicago - Detroit",
          "Miami - Orlando",
          "Seattle - Portland",
          "Dallas - Houston"
        ].map((route, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800">{route}</h3>
            <p className="text-gray-600 mt-2">Starting from $29</p>
            <button className="mt-3 text-red-600 hover:text-red-700">
              View Schedule →
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default Home
