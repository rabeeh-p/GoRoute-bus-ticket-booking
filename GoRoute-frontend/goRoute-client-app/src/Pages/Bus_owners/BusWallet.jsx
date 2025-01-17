import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BusWallet = () => {
  const [balance, setBalance] = useState(0);  
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchWalletData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/admin-login");  
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/wallet/", {
          headers: {
            
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const fetchedBalance = parseFloat(response.data.balance);
        setBalance(isNaN(fetchedBalance) ? 0 : fetchedBalance);  
        setTransactions(response.data.transactions || []);
        console.log(response.data, "data wallet");
      } catch (err) {
        setError("Failed to fetch wallet data. Please try again later.");
        console.log(err, "err");
      }
    };

    fetchWalletData();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 md:p-8 transition-all duration-300 ease-in-out">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-bold text-red-600 mb-8"
        >
          RedBus Wallet
        </motion.h2>

        {error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center shadow-md"
            >
              <span className="text-xl font-semibold text-white mb-2 md:mb-0">
                Total Balance
              </span>
              <span className="text-3xl font-bold text-white">
                ₹{balance.toFixed(2)} {/* Safely use .toFixed on balance */}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Transaction History
              </h3>

              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto">
                    <thead>
                      <tr className="bg-red-100">
                        <th className="py-3 px-4 text-red-800 font-semibold">
                          Description
                        </th>
                        <th className="py-3 px-4 text-red-800 font-semibold">
                          Date
                        </th>
                        <th className="py-3 px-4 text-red-800 font-semibold">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                          }}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-gray-50" : ""
                          } hover:bg-red-50 transition-colors duration-150`}
                        >
                          <td className="py-3 px-4 text-gray-700">
                            {transaction.description}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {transaction.timestamp}
                          </td>
                          <td
                            className={`py-3 px-4 font-semibold ${
                              transaction.amount < 0
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            ₹{Math.abs(transaction.amount).toFixed(2)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No transactions available.
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default BusWallet;
