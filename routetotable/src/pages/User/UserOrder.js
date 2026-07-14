import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";

const UserOrders = () => {
  const userId = localStorage.getItem("id");

  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8087/order/user/${userId}`
      );

      const enriched = await Promise.all(
        res.data.map(async (o) => {
          try {
            const hotelRes = await axios.get(
              `http://localhost:8082/hotel/${o.hotelId}`
            );

            return {
              ...o,
              hotelName: hotelRes.data.h_name,
            };
          } catch {
            return {
              ...o,
              hotelName: "Unknown Hotel",
            };
          }
        })
      );

      setOrders(enriched);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelOrder = async (id, bookingId, isParcel) => {
    try {
      await axios.put(`http://localhost:8087/order/cancel/${id}`);

      if (isParcel) {
        await axios.put(
          `http://localhost:8084/booking/cancel/${bookingId}`
        );
      } else {
        await axios.put(
          `http://localhost:8084/booking/cancel/${bookingId}`
        );

        await axios.delete(
          `http://localhost:8085/table/release/${bookingId}`
        );
      }

      fetchOrders();
    } catch (err) {
      console.log(err);
      alert("Failed to cancel order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* LEFT PANEL */}
      <div className="w-1/4 bg-white shadow-lg p-8">
        <ShoppingBag className="text-primary w-10 h-10" />

        <h1 className="text-2xl font-bold mt-4">
          Your Orders
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Track parcel & table bookings
        </p>

        <div className="mt-6 text-xs text-gray-400 space-y-2">
          <p>✔ 20% advance payment system</p>
          <p>✔ Track remaining amount</p>
          <p>✔ Cancel active orders</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-3/4 h-screen overflow-y-auto p-4 space-y-6">
        {orders.map((o) => {
          const total = Number(o.amount);
          const advance = total * 0.2;
          const remaining = total * 0.8;

          
          let parsedCart = {};
          try {
            parsedCart =
              typeof o.cartJson === "string"
                ? JSON.parse(o.cartJson)
                : o.cartJson;
          } catch {
            parsedCart = {};
          }

          const items = parsedCart?.items || [];
          const isParcel = parsedCart?.bookingType === "parcel";

          
          let refundAmount = 0;
          if (o.status === "REFUNDED") {
            if (isParcel) {
              refundAmount = advance * 0.95;
            } else {
              refundAmount = advance * 0.98;
            }
          }

          return (
            <div
              key={o.id}
              className="bg-white rounded-2xl shadow-md p-6 flex justify-between"
            >
              {/* LEFT */}
              <div className="flex-1">
                <h4 className="font-bold text-xl">
                  🏨 {o.hotelName}
                </h4>

                <p className="text-sm text-gray-500">
                  Order ID: #{o.id}
                </p>

                {/* PAYMENT BOX */}
                <div className="mt-3 bg-gray-50 p-3 rounded-xl text-sm space-y-1">
                  <p className="font-semibold">
                    {isParcel ? "📦 Parcel Order" : "🍽️ Table Booking"}
                  </p>

                  {o.status === "REFUNDED" ? (
                    <>
                      <p className="text-red-500 font-semibold">
                        🔴 Paid: ₹{advance.toFixed(2)}
                      </p>

                      <p className="text-green-600 font-bold">
                        💸 Refunded: ₹{refundAmount.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>💰 Total: ₹{total}</p>

                      <p className="text-green-600">
                        ✅ Paid (20%): ₹{advance}
                      </p>

                      <p className="text-red-500">
                        ⏳ Remaining (80%): ₹{remaining}
                      </p>
                    </>
                  )}
                </div>

                {/* VIEW ITEMS */}
                <button
                  onClick={() =>
                    setOpenId(openId === o.id ? null : o.id)
                  }
                  className="flex items-center gap-2 text-primary mt-3 text-sm font-semibold"
                >
                  {openId === o.id ? (
                    <>
                      <EyeOff size={14} />
                      Hide Items
                    </>
                  ) : (
                    <>
                      <Eye size={14} />
                      View Items
                    </>
                  )}
                </button>

                {/* ITEMS */}
                {openId === o.id && (
                  <div className="mt-3 bg-gray-50 p-4 rounded-xl space-y-2">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm"
                      >
                        <span>{item.itemName}</span>
                        <span>
                          ₹{item.price} × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="text-right flex flex-col justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold
                    ${
                      o.status === "PAID"
                        ? "bg-green-100 text-green-600"
                        : o.status === "CANCELLED"
                        ? "bg-red-100 text-red-600"
                        : o.status === "REFUNDED"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                >
                  {o.status}
                </span>

                <p className="text-xs text-gray-400 mt-4">
                  {new Date(o.createdAt).toLocaleString()}
                </p>

                {/* ❌ HIDE CANCEL IF REFUNDED */}
                {o.status !== "CANCELLED" &&
                  o.status !== "DELIVERED" &&
                  o.status !== "REFUNDED" &&
                 
                  (
                    <button
                      onClick={() =>
                        cancelOrder(o.id, o.bookingId, isParcel)
                      }
                      className="mt-4 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      ❌ Cancel
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrders;