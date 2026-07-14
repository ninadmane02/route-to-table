import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Trash2 } from "lucide-react";

const Bookings = () => {
const [bookings, setBookings] = useState([]);
const hotelId = localStorage.getItem("id");
const hotelName = localStorage.getItem("name");

useEffect(() => {
fetchBookings();
}, []);

const fetchBookings = async () => {
try {
const res = await axios.get(
`http://localhost:8084/booking/hotel/${hotelId}`
);


  const enriched = await Promise.all(
    res.data.map(async (b) => {
      try {
        
        const userRes = await axios.get(
          `http://localhost:8081/user/${b.userId}`
        );
         
        return {
          ...b,
          username: userRes.data.u_name,
        };
      } catch {
        return {
          ...b,
          username: "Unknown User",
        };
      }
    })
  );
console.log(enriched)
  setBookings(enriched);
} catch (err) {
  console.log(err);
}


};

const cancelBooking = (id) => {
axios
.delete(`http://localhost:8084/booking/cancel/${id}`)
.then(() => fetchBookings());
};


const refundBooking = (id) => {
  axios.put(`http://localhost:8087/order/refund/${id}`)

axios.put(`http://localhost:8084/booking/refund/${id}`)
.then(() => fetchBookings());
};

return ( <div className="flex min-h-screen bg-gray-50">

```
  <Sidebar hotelName={hotelName} />

  <main className="flex-1 p-10 ml-[20%]">

    <h2 className="text-3xl font-bold mb-6">📅 Bookings</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {bookings.map((b) => {

        const statusStyle =
          b.status === "CONFIRMED"
            ? "border-green-500 bg-green-50 text-green-600"
            : b.status === "CANCELLED"
            ? "border-red-500 bg-red-50 text-red-600"
            : b.status === "WAITLIST"
            ? "border-yellow-500 bg-yellow-50 text-yellow-600"
            : b.status === "REFUNDED"
            ? "border-blue-500 bg-blue-50 text-blue-600"
            : "border-gray-300 bg-white text-gray-600";

        return (
          <div
            key={b.id}
            className={`rounded-2xl shadow-md p-5 border-l-4 ${statusStyle}`}
          >

          
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-lg">
                👤 {b.username}
              </h4>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white shadow">
                {b.status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>📅 {b.bookingDate}</p>
              <p>⏰ Booking Time: {b.bookingTime}</p>
              <p>👥 Persons: {b.persons}</p>
              <p>🪑 Table: {b.tableId || "Not assigned"}</p>
            </div>

           
            {b.status !== "CANCELLED" && b.status !== "REFUNDED" && (
              <button
                onClick={() => cancelBooking(b.id)}
                className="mt-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
              >
                <Trash2 size={16} /> Cancel
              </button>
            )}

        
            {b.status === "CANCELLED" && (
              <button
                onClick={() => refundBooking(b.id)}
                className="mt-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
              >
                💰 Refund
              </button>
            )}

          </div>
        );
      })}

    </div>
  </main>
</div>


);
};

export default Bookings;
