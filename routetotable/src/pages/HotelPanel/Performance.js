import React, { useEffect, useState } from "react";
import axios from "axios";

const Performance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const hotelId = localStorage.getItem("id");

    if (hotelId) {
      fetchData(hotelId);
    }
  }, []);

  const fetchData = async (hotelId) => {
    try {
      const res = await axios.get(
        `http://localhost:8087/order/earnings/${hotelId}`
      );

      setData(res.data);
    } catch (err) {
      console.log("Performance API error:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">

      <h2 className="text-lg font-bold mb-6">
        📊 Performance (Earnings Growth)
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-400 text-center">
          No data available
        </p>
      ) : (
        <div className="flex items-end gap-4 h-48">

          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">

              {/* BAR */}
              <div
                className="bg-blue-500 w-6 rounded-md transition-all"
                style={{
                  height: `${item.earnings / 50}px`
                }}
              ></div>

              {/* LABEL */}
              <p className="text-xs mt-2 text-gray-600">
                {item.day}
              </p>

              {/* VALUE */}
              <p className="text-xs font-bold text-blue-600">
                ₹{item.earnings}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Performance;