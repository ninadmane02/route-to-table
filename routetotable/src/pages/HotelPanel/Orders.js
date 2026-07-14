import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Eye, EyeOff, UtensilsCrossed } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);

  const hotelId = localStorage.getItem("id");
  const hotelName = localStorage.getItem("name");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8087/order/hotel/${hotelId}`
      );

      const enriched = await Promise.all(
        res.data.map(async (o) => {
          try {
            const user = await axios.get(
              `http://localhost:8081/user/${o.userId}`
            );

            return {
              ...o,
              userName: user.data.u_name,
              mobile: user.data.u_mobile,
            };
          } catch {
            return {
              ...o,
              userName: "Unknown",
              mobile: "-",
            };
          }
        })
      );

      setOrders(enriched);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleItems = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar hotelName={hotelName} />

      <main className="flex-1 p-10 ml-[20%]">
        <h2 className="text-3xl font-bold mb-6">📦 Orders</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((o) => {
            const statusStyle =
              o.status === "PAID"
                ? "bg-green-100 text-green-600"
                : o.status === "PENDING"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600";

           const parsedCart = JSON.parse(o.cartJson || "{}");
const cart = parsedCart.items || [];

const bookingtype=parsedCart.bookingType;
            console.log(bookingtype)
            let paidAmount = 0;
            let refundAmount = 0;

            if (o.status === "REFUNDED") {
              paidAmount = o.amount * 0.2;
console.log(o.amount)
              if (bookingtype === "parcel") {
                refundAmount = paidAmount * 0.95;
                console.log(refundAmount)
              } else if (bookingtype === "table") {
                refundAmount = paidAmount * 0.98;
              }
            }

            return (
              <div
                key={o.id}
                className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between"
              >
                {/* HEADER */}
               <div className="flex justify-between items-center mb-2">
  <p className="text-xs text-gray-400">🧾 #{o.id}</p>

  <div className="flex gap-2">
    {/* Booking Type */}
    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-semibold">
      {bookingtype.toUpperCase()}
    </span>

    {/* Status */}
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle}`}
    >
      {o.status}
    </span>
  </div>
</div>

                {/* USER INFO */}
                <div className="mb-3">
                  <h4 className="font-bold text-lg">👤 {o.userName}</h4>
                  <p className="text-sm text-gray-500">
                    📱 {o.mobile}
                  </p>
                </div>

                {/* 💰 AMOUNT / REFUND DISPLAY */}
                {o.status === "REFUNDED" ? (
                  <div className="text-sm space-y-1 mb-2">
                    <p className="text-red-500 font-semibold">
                      🔴 Paid: ₹{paidAmount.toFixed(2)}
                    </p>
                    <p className="text-green-600 font-bold">
                      💸 Refunded: ₹{refundAmount.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-green-600 mb-2">
                    💰 ₹{o.amount}
                  </p>
                )}

                {/* TOGGLE BUTTON */}
                <button
                  onClick={() => toggleItems(o.id)}
                  className="flex items-center justify-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                >
                  {openOrderId === o.id ? (
                    <>
                      <EyeOff size={16} /> Hide Items
                    </>
                  ) : (
                    <>
                      <Eye size={16} /> View Items
                    </>
                  )}
                </button>

                {/* ITEMS */}
                {openOrderId === o.id && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2">
                      <UtensilsCrossed size={14} />
                      Order Summary
                    </div>

                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm py-1 border-b last:border-b-0"
                      >
                        <span className="text-gray-700">
                          🍽 {item.itemName || item.name}
                        </span>

                        <span className="text-gray-500 font-medium">
                          ₹{item.price} × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* FOOTER */}
                <p className="text-xs text-gray-400 mt-4 text-right">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Orders;