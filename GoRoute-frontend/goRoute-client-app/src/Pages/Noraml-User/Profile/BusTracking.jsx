"use client"

import React, { useState, useEffect } from "react"
import { Bus, MapPin } from "lucide-react"

const BusTracking = () => {
  const [busData, setBusData] = useState({
    bus_number: "ABC123",
    stops: [
      { stop_name: "Bus Station A", stop_order: 1, arrival_time: "15:00", departure_time: "15:05" },
      { stop_name: "Bus Station B", stop_order: 2, arrival_time: "15:15", departure_time: "15:20" },
      { stop_name: "Bus Station C", stop_order: 3, arrival_time: "15:30", departure_time: "15:35" },
      { stop_name: "Bus Station D", stop_order: 4, arrival_time: "15:45", departure_time: "15:50" },
    ],
  })
  const [currentStop, setCurrentStop] = useState(0)
  const [busPosition, setBusPosition] = useState(0)

  useEffect(() => {
    if (currentStop < busData.stops.length) {
      setBusPosition((currentStop / (busData.stops.length - 1)) * 100)
      const timer = setTimeout(() => {
        setCurrentStop(currentStop + 1)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [currentStop, busData.stops.length])

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
        <div className="bg-red-600 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold flex items-center justify-center">
            <Bus className="mr-2" /> RedBus Tracking
          </h1>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Current Location</h2>
            <div className="flex items-center justify-center space-x-4 p-4 bg-red-100 rounded-lg">
              <MapPin className="text-red-600" />
              <span className="text-lg font-medium text-red-600">
                {busData.stops[currentStop]?.stop_name || "End of Route"}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Route Progress</h2>
            <div className="relative w-full h-4 bg-gray-200 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${busPosition}%` }}
              />
              {busData.stops.map((stop, index) => (
                <div
                  key={stop.stop_order}
                  className="absolute top-full mt-2"
                  style={{ left: `${(index / (busData.stops.length - 1)) * 100}%` }}
                >
                  <div className="w-3 h-3 bg-red-600 rounded-full mb-1 mx-auto" />
                  <div className="text-xs font-medium text-gray-600 text-center">{stop.stop_name}</div>
                  <div className="text-xs text-gray-500 text-center">{stop.arrival_time}</div>
                </div>
              ))}
              <div
                className="absolute top-0 w-8 h-8 bg-red-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ease-in-out"
                style={{ left: `calc(${busPosition}% - 16px)`, top: "-10px" }}
              >
                <Bus className="text-white w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Route Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="font-medium text-gray-600">From</div>
                <div className="text-lg text-red-600">{busData.stops[0]?.stop_name}</div>
              </div>
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="font-medium text-gray-600">To</div>
                <div className="text-lg text-red-600">{busData.stops[busData.stops.length - 1]?.stop_name}</div>
              </div>
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="font-medium text-gray-600">Next Stop</div>
                <div className="text-lg text-red-600">
                  {busData.stops[currentStop + 1]?.stop_name || "End of Route"}
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="font-medium text-gray-600">Estimated Arrival</div>
                <div className="text-lg text-red-600">{busData.stops[currentStop + 1]?.arrival_time || "N/A"}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition-all"
              onClick={() => {
                setCurrentStop(0)
                setBusPosition(0)
              }}
            >
              Refresh Location
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusTracking
