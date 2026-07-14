import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Clock } from "lucide-react";

const UserWaitlist = () => {
const userId = localStorage.getItem("id");

const [waitlist, setWaitlist] = useState([]);
const [openId, setOpenId] = useState(null);

useEffect(() => {
fetchWaitlist();
}, []);

const fetchWaitlist = async () => {
try {
const res = await axios.get(
`http://localhost:8085/table/waitlist/user/${userId}`
);


  const enriched = await Promise.all(
    res.data.map(async (w) => {
      try {
        const hotelRes = await axios.get(
          `http://localhost:8082/hotel/${w.hotelId}`
        );

        return {
          ...w,
          hotelName: hotelRes.data.h_name,
        };
      } catch {
        return {
          ...w,
          hotelName: "Unknown Hotel",
        };
      }
    })
  );

  setWaitlist(enriched);
} catch (err) {
  console.log(err);
}


};

const cancelWaitlist = async (id) => {
try {
await axios.delete(
`http://localhost:8085/table/waitlist/delete/${id}`
);
fetchWaitlist();
} catch (err) {
console.log(err);
alert("Failed to cancel waitlist");
}
};

return ( <div className="min-h-screen bg-gray-100 flex">


  {/* LEFT PANEL */}
  <div className="w-1/4 bg-white shadow-lg p-8">
    <Clock className="text-primary w-10 h-10" />

    <h1 className="text-2xl font-bold mt-4">
      Your Waitlist
    </h1>

    <p className="text-gray-500 text-sm mt-2">
      Track your waiting table requests
    </p>

    <div className="mt-6 text-xs text-gray-400 space-y-2">
      <p>✔ Auto table assignment</p>
      <p>✔ Real-time updates</p>
      <p>✔ Cancel anytime</p>
    </div>
  </div>

  {/* RIGHT PANEL */}
  <div className="w-3/4 h-screen overflow-y-auto p-4 space-y-6">

    {waitlist.map((w) => (
      <div
        key={w.id}
        className="bg-white rounded-2xl shadow-md p-6 flex justify-between"
      >

        {/* LEFT */}
        <div className="flex-1">

          <h4 className="font-bold text-xl">
            🏨 {w.hotelName}
          </h4>

          <p className="text-sm text-gray-500">
            Waitlist ID: #{w.id}
          </p>

          <div className="mt-3 bg-gray-50 p-3 rounded-xl text-sm space-y-1">

            <p>📅 Date: {w.bookingDate}</p>

            <p>👥 Guests: {w.persons}</p>

            <p>🪑 Slot ID: {w.slotId}</p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="text-right flex flex-col justify-between">

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-600">
            WAITING
          </span>

          <p className="text-xs text-gray-400 mt-4">
            {new Date(w.createdAt).toLocaleString()}
          </p>

          <button
            onClick={() => cancelWaitlist(w.id)}
            className="mt-4 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            ❌ Cancel
          </button>

        </div>

      </div>
    ))}

  </div>
</div>


);
};

export default UserWaitlist;
