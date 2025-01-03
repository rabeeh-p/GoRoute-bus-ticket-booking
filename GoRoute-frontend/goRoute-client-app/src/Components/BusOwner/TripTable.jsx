export default function TripTable() {
    const trips = [
      { id: 1, route: 'Mumbai to Pune', date: '2023-07-15', time: '08:00 AM', seats: '45/50' },
      { id: 2, route: 'Delhi to Jaipur', date: '2023-07-16', time: '09:30 AM', seats: '38/50' },
      { id: 3, route: 'Bangalore to Chennai', date: '2023-07-17', time: '10:00 AM', seats: '42/50' },
      { id: 4, route: 'Kolkata to Siliguri', date: '2023-07-18', time: '07:00 AM', seats: '48/50' },
    ]
  
    return (
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
        <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">Upcoming Trips</h3>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">Route</th>
                <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">Date</th>
                <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">Time</th>
                <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">Seats Booked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trips.map((trip) => (
                <tr key={trip.id} className="text-gray-500">
                  <td className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">{trip.route}</td>
                  <td className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4">{trip.date}</td>
                  <td className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4">{trip.time}</td>
                  <td className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4">{trip.seats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  