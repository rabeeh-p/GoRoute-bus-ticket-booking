import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import { useNavigate, useParams } from "react-router-dom";
import BusCard from "../../Components/Bus/BusCard"; // Adjust the path based on your file structure
import OrdersTable from "../../Components/BusOwner/OrdersTable";
import useLogout from '../../Hook/useLogout';

const ScheduledBusDetails = () => {
  const { busId } = useParams();
  const [busDetails, setBusDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [seatNumbers, setSeatNumbers] = useState([])
  const [orders, setOrders] = useState([])
  const { handleLogout } = useLogout();


  console.log(seatNumbers,'numbers');
  console.log(orders,'orders');
  

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   if (!accessToken) {
  //     navigate("/login");
  //     return;
  //   }

  //   axiosInstance
  //     .get(`/scheduled-buses/${busId}/`, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     })
  //     .then((response) => {
  //       setBusDetails(response.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //       setError("Failed to fetch bus details");
  //       setLoading(false);
  //     });
  // }, [busId, navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchBusDetails = async () => {
      try {
        // Fetch bus details
        const busResponse = await axiosInstance.get(`/scheduled-buses/${busId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBusDetails(busResponse.data);

        // Fetch seat numbers
        const seatNumbersResponse = await axiosInstance.get(`/api/bus/${busId}/seat-numbers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(seatNumbersResponse.data,'data respon');
        
        
        

        const seatNumbers = seatNumbersResponse.data.booked_seats.map(seat => seat.seats.map(s => s.seat_number)).flat();
      setSeatNumbers(seatNumbers);

      // Extracting order details
      const orders = seatNumbersResponse.data.booked_seats.map(seat => seat.order);
      setOrders(orders);

        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleLogout();  
        } else {
          console.log("Error fetching data:", err);
          setError("Failed to fetch data");
          setLoading(false);
        }
         
      }
    };

    fetchBusDetails();
  }, [busId, navigate]);



  if (loading) {
    return <div className="text-center text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

 



  // const renderSeatLayout = () => {
  //   const { seat_count, seat_type } = busDetails;
  
  //   if (!seat_count || typeof seat_count !== "number" || seat_count <= 0) {
  //     return <p className="text-gray-600">No seat data available.</p>;
  //   }
  
  //   const getSeatStyle = (type) => {
  //     switch (type) {
  //       case "standard":
  //         return "w-8 h-8 bg-gray-400 text-white rounded-md shadow-md";
  //       case "recliner":
  //         return "w-12 h-12 bg-blue-400 text-white rounded-lg shadow-lg";
  //       case "luxury":
  //         return "w-16 h-16 bg-yellow-500 text-black rounded-full shadow-lg";
  //       case "semi_sleeper":
  //         return "w-12 h-24 bg-purple-400 text-white rounded-md shadow-md";
  //       case "full_sleeper":
  //         return "w-12 h-24 bg-green-500 text-white rounded-md shadow-md";
  //       default:
  //         return "w-8 h-8 bg-gray-400 text-white rounded-md shadow-md";
  //     }
  //   };
  
  //   const renderSingleDeck = () => {
  //     const totalRows = Math.ceil(seat_count / 5); // Two on the left, three on the right
  //     const seats = Array.from({ length: seat_count }, (_, index) => index + 1);
  
  //     const leftSeats = seats.filter((_, index) => index % 5 < 2);
  //     const rightSeats = seats.filter((_, index) => index % 5 >= 2);
  
  //     const leftSeatRows = Array.from({ length: totalRows }, (_, row) =>
  //       leftSeats.slice(row * 2, row * 2 + 2)
  //     );
  //     const rightSeatRows = Array.from({ length: totalRows }, (_, row) =>
  //       rightSeats.slice(row * 3, row * 3 + 3)
  //     );
  
  //     return (
  //       <div className="flex flex-col space-y-4">
  //         {leftSeatRows.map((row, rowIndex) => (
  //           <div key={rowIndex} className="flex space-x-8 justify-center mb-2">
  //             {/* Left Side Seats */}
  //             <div className="flex space-x-4">
  //               {row.map((seat) => (
  //                 <div
  //                   key={seat}
  //                   className={`${getSeatStyle(seat_type)} flex items-center justify-center`}
  //                 >
  //                   {seat}
  //                 </div>
  //               ))}
  //             </div>
  
  //             {/* Right Side Seats */}
  //             <div className="flex space-x-4">
  //               {rightSeatRows[rowIndex]?.map((seat) => (
  //                 <div
  //                   key={seat}
  //                   className={`${getSeatStyle(seat_type)} flex items-center justify-center`}
  //                 >
  //                   {seat}
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   };
  
  //   const renderDoubleDeck = () => {
  //     const halfSeatCount = Math.floor(seat_count / 2);
  //     const seats = Array.from({ length: seat_count }, (_, index) => index + 1);
  
  //     const upperDeckSeats = seats.slice(0, halfSeatCount);
  //     const lowerDeckSeats = seats.slice(halfSeatCount);
  
  //     const renderDeck = (deckSeats, label) => {
  //       const totalRows = Math.ceil(deckSeats.length / 3);
  //       const leftSeats = deckSeats.filter((_, index) => index % 3 === 0);
  //       const rightSeats = deckSeats.filter((_, index) => index % 3 !== 0);
  
  //       const leftSeatRows = Array.from({ length: totalRows }, (_, row) =>
  //         leftSeats.slice(row * 1, row * 1 + 1)
  //       );
  //       const rightSeatRows = Array.from({ length: totalRows }, (_, row) =>
  //         rightSeats.slice(row * 2, row * 2 + 2)
  //       );
  
  //       return (
  //         <div className="w-full space-y-4">
  //           <h3 className="text-gray-700 font-medium text-center">{label}</h3>
  //           <div className="flex flex-col space-y-4 justify-center">
  //             {leftSeatRows.map((row, rowIndex) => (
  //               <div key={rowIndex} className="flex space-x-8 justify-center mb-2">
  //                 {/* Left Side Seats */}
  //                 <div className="flex space-x-4">
  //                   {row.map((seat) => (
  //                     <div
  //                       key={seat}
  //                       className={`${getSeatStyle(seat_type)} flex items-center justify-center`}
  //                     >
  //                       {seat}
  //                     </div>
  //                   ))}
  //                 </div>
  
  //                 {/* Right Side Seats */}
  //                 <div className="flex space-x-4">
  //                   {rightSeatRows[rowIndex]?.map((seat) => (
  //                     <div
  //                       key={seat}
  //                       className={`${getSeatStyle(seat_type)} flex items-center justify-center`}
  //                     >
  //                       {seat}
  //                     </div>
  //                   ))}
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       );
  //     };
  
  //     return (
  //       <div className="flex space-x-12">
  //         <div className="w-1/2">{renderDeck(upperDeckSeats, "Upper Deck")}</div>
  //         <div className="w-1/2">{renderDeck(lowerDeckSeats, "Lower Deck")}</div>
  //       </div>
  //     );
  //   };
  
  //   return (
  //     <div className="w-full">
  //       {seat_type === "full_sleeper" ? renderDoubleDeck() : renderSingleDeck()}
  //     </div>
  //   );
  // };
  


  const renderSeatLayout = () => {
    const { seat_count, seat_type } = busDetails;

    if (!seat_count || typeof seat_count !== "number" || seat_count <= 0) {
      return <p className="text-gray-600">No seat data available.</p>;
    }

    const getSeatStyle = (seatNumber, type) => {
      const isBooked = seatNumbers.includes(seatNumber);
      const baseStyle = isBooked
        ? "w-8 h-8 bg-red-500 text-white rounded-md shadow-md" // red for booked seats
        : "w-8 h-8 bg-gray-400 text-white rounded-md shadow-md"; // gray for available seats

      switch (type) {
        case "standard":
          return baseStyle;
        case "recliner":
          return isBooked
            ? "w-12 h-12 bg-red-500 text-white rounded-lg shadow-lg"
            : "w-12 h-12 bg-blue-400 text-white rounded-lg shadow-lg";
        case "luxury":
          return isBooked
            ? "w-16 h-16 bg-red-500 text-white rounded-full shadow-lg"
            : "w-16 h-16 bg-yellow-500 text-black rounded-full shadow-lg";
        case "semi_sleeper":
          return isBooked
            ? "w-12 h-24 bg-red-500 text-white rounded-md shadow-md"
            : "w-12 h-24 bg-purple-400 text-white rounded-md shadow-md";
        case "full_sleeper":
          return isBooked
            ? "w-12 h-24 bg-red-500 text-white rounded-md shadow-md"
            : "w-12 h-24 bg-green-500 text-white rounded-md shadow-md";
        default:
          return baseStyle;
      }
    };

    const renderSingleDeck = () => {
      const totalRows = Math.ceil(seat_count / 5); // Two on the left, three on the right
      const seats = Array.from({ length: seat_count }, (_, index) => index + 1);

      const leftSeats = seats.filter((_, index) => index % 5 < 2);
      const rightSeats = seats.filter((_, index) => index % 5 >= 2);

      const leftSeatRows = Array.from({ length: totalRows }, (_, row) =>
        leftSeats.slice(row * 2, row * 2 + 2)
      );
      const rightSeatRows = Array.from({ length: totalRows }, (_, row) =>
        rightSeats.slice(row * 3, row * 3 + 3)
      );

      return (
        <div className="flex flex-col space-y-4">
          {leftSeatRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-8 justify-center mb-2">
              {/* Left Side Seats */}
              <div className="flex space-x-4">
                {row.map((seat) => (
                  <div
                    key={seat}
                    className={`${getSeatStyle(seat, seat_type)} flex items-center justify-center`}
                  >
                    {seat}
                  </div>
                ))}
              </div>

              {/* Right Side Seats */}
              <div className="flex space-x-4">
                {rightSeatRows[rowIndex]?.map((seat) => (
                  <div
                    key={seat}
                    className={`${getSeatStyle(seat, seat_type)} flex items-center justify-center`}
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    };

    const renderDoubleDeck = () => {
      const halfSeatCount = Math.floor(seat_count / 2);
      const seats = Array.from({ length: seat_count }, (_, index) => index + 1);

      const upperDeckSeats = seats.slice(0, halfSeatCount);
      const lowerDeckSeats = seats.slice(halfSeatCount);

      const renderDeck = (deckSeats, label) => {
        const totalRows = Math.ceil(deckSeats.length / 3);
        const leftSeats = deckSeats.filter((_, index) => index % 3 === 0);
        const rightSeats = deckSeats.filter((_, index) => index % 3 !== 0);

        const leftSeatRows = Array.from({ length: totalRows }, (_, row) =>
          leftSeats.slice(row * 1, row * 1 + 1)
        );
        const rightSeatRows = Array.from({ length: totalRows }, (_, row) =>
          rightSeats.slice(row * 2, row * 2 + 2)
        );

        return (
          <div className="w-full space-y-4">
            <h3 className="text-gray-700 font-medium text-center">{label}</h3>
            <div className="flex flex-col space-y-4 justify-center">
              {leftSeatRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex space-x-8 justify-center mb-2">
                  {/* Left Side Seats */}
                  <div className="flex space-x-4">
                    {row.map((seat) => (
                      <div
                        key={seat}
                        className={`${getSeatStyle(seat, seat_type)} flex items-center justify-center`}
                      >
                        {seat}
                      </div>
                    ))}
                  </div>

                  {/* Right Side Seats */}
                  <div className="flex space-x-4">
                    {rightSeatRows[rowIndex]?.map((seat) => (
                      <div
                        key={seat}
                        className={`${getSeatStyle(seat, seat_type)} flex items-center justify-center`}
                      >
                        {seat}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      };

      return (
        <div className="flex space-x-12">
          <div className="w-1/2">{renderDeck(upperDeckSeats, "Upper Deck")}</div>
          <div className="w-1/2">{renderDeck(lowerDeckSeats, "Lower Deck")}</div>
        </div>
      );
    };

    return (
      <div className="w-full">
        {seat_type === "full_sleeper" ? renderDoubleDeck() : renderSingleDeck()}
      </div>
    );
};

  
  

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-red-600 text-white py-2 px-4 rounded-md mb-6 hover:bg-red-700 transition duration-300"
      >
        Back to List
      </button>

      <div className="grid lg:grid-cols-2 gap-6">
        <BusCard
          busNumber={busDetails.bus_number}
          busType={busDetails.bus_type}
          ownerName={busDetails.bus_owner_name}
          seatType={busDetails.seat_type}
          seatCount={busDetails.seat_count}
          route={busDetails.route}
          scheduledDate={busDetails.scheduled_date}
          description={busDetails.description}
        />

        {/* Route & Stops Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Route & Stops</h2>
          <div className="space-y-4">
            {busDetails.stops && busDetails.stops.length > 0 ? (
              busDetails.stops.map((stop, index) => (
                <div key={index} className="border-b border-gray-200 py-2">
                  <p className="font-semibold text-gray-800">
                    Stop {index + 1}: {stop.stop_name}
                  </p>
                  <p className="text-gray-600">Arrival Time: {stop.arrival_time}</p>
                  <p className="text-gray-600">Departure Time: {stop.departure_time}</p>
                  {stop.description && <p className="text-gray-600">Description: {stop.description}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No stops available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Bus Layout</h2>
        <div className="flex flex-col items-center">
          <div className="w-28 h-20 bg-gray-800 text-white flex items-center justify-center rounded-md shadow-md mb-4">
            Driver
          </div>
          {renderSeatLayout()}
        </div>
      </div>
      <OrdersTable orders={orders}/>
    </div>
  );
};

export default ScheduledBusDetails;
