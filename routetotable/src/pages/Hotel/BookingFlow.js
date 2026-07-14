import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  ShoppingCart,
  CreditCard,
  Check
} from "lucide-react";

const BookingFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cart = location.state?.cart || [];
  const hotelId = location.state?.hotelId;
  console.log(hotelId)

  const [step, setStep] = useState(0);
  const [bookingType, setBookingType] = useState("");
const [tId, setTId] = useState(null);
  const [booking, setBooking] = useState({
    date: "", 
    time: "",
    guests: 2
  });

  const [bookingId, setBookingId] = useState(null);

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const bookingFee = bookingType === "table" ? 5 : 0;

  const updateBooking = (data) => {
    setBooking((prev) => ({ ...prev, ...data }));
  };

  const getSteps = () => {
    if (bookingType === "parcel") {
      return [
        { icon: <ShoppingCart />, label: "Pre-order Food" },
        { icon: <CreditCard />, label: "Checkout" }
      ];
    }

    return [
      { icon: <Calendar />, label: "Reservation" },
      { icon: <ShoppingCart />, label: "Pre-order Food" },
      { icon: <CreditCard />, label: "Checkout" }
    ];
  };

  const steps = getSteps();

//   const checkAvailability = async () => {
//   const res = await axios.post(
//     "http://localhost:8085/table/assign",
//     {
//       hotelId,
//       booking_date: booking.date,
//       booking_time: booking.time,
//       persons: booking.guests
//     }
//   );
// console.log(res.data)
//   // return res.data.available;
// };

const checkAvailability = async () => {
  const payload1 = {
  hotelId: hotelId,
  bookingDate: booking.date,
  bookingTime: booking.time,
  persons: booking.guests
};
  try {
    const res = await axios.post(
      "http://localhost:8085/table/check-availability",
      payload1
    );

    console.log("Response:", res.data);

    if (res.data.success) {
      alert("Table assigned: " + res.data.tableId);
      return res.data;
    } else {
      alert(res.data.message); // No table available
      return res.data;
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};
  const createBooking = async (tableId,slotId) => {
    console.log(tableId)
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const payload = {
        userId: user?.id,
        hotelId,

        
        bookingDate:
          bookingType === "table"
            ? booking.date
            : new Date().toISOString().split("T")[0],

        bookingTime: booking.time,

        persons:
          bookingType === "table"
            ? booking.guests
            : 1,

        status: "PENDING",
        type: bookingType ,
        tableId:tableId,
        slotId:slotId
      };

      const res = await axios.post(
        "http://localhost:8084/booking/create",
        payload
      );

      setBookingId(res.data.id);
      setStep(2);

    } catch (err) {
      console.log(err);
      alert("Booking failed");
    }
  };

const handleTableNext = async () => {
  const available = await checkAvailability();
console.log(available)
  if (available.success) {
     setTId(available.tableId);
    
    createBooking(available.tableId, available.slotId);
  } else {
    const confirmWaitlist = window.confirm(
      "Table not available. Join waitlist?"
    );

    if (confirmWaitlist) {
      await joinWaitlist(available.slotId);   
    } else {
      
      return;
    }
  }
};

const joinWaitlist = async (slotId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const payload = {
      userId: user?.id,
      hotelId,
      bookingDate: booking.date,
      bookingTime: booking.time,
      persons: booking.guests,
      status: "WAITLIST",
      slotId:slotId,
      cartJson: JSON.stringify({
    items: cart,
    tableId: tId,  
    bookingType: bookingType
  }),
    };

    await axios.post(
      "http://localhost:8085/table/waitlist/booking/add",
      payload
    );

    alert("Added to waitlist successfully");
    navigate("/"); // or show confirmation screen

  } catch (err) {
    console.log(err);
    alert("Failed to join waitlist");
  }
};
  const handleFinalize = async () => {
    console.log(tId)
    try {
      const actualAmount = (total ) * 100;
const advancePercent = 20;

const advanceAmount = Math.round((total + bookingFee) * advancePercent / 100);

const amount = advanceAmount * 100;
      const res = await axios.post(
        "http://localhost:8088/payment/create",
        { amount }
      );

      const order = res.data;

      const options = {
        key: "rzp_test_SdrTiCChXve6nk",
        amount: order.amount,
        currency: "INR",
        name: "Restaurant Booking",
        order_id: order.id,

        handler: async (response) => {
          try {

            await axios.post(
              "http://localhost:8088/payment/verify",
              {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: bookingId 
              }
            );
 
            await axios.post(
              "http://localhost:8087/order/create",
              {
                bookingId: bookingId,
                userId: JSON.parse(localStorage.getItem("user"))?.id,
                hotelId,
                 cartJson: JSON.stringify({
    items: cart,
    tableId: tId,  
    bookingType: bookingType
  }),

                amount: total ,
                status: "CONFIRMED",
                type: bookingType
              }
            );

           
            await axios.put(
              `http://localhost:8084/booking/confirm/${bookingId}`,
              { status: "CONFIRMED" }
            );
            const userId=JSON.parse(localStorage.getItem("user"))?.id
            await axios.delete(
  `http://localhost:8086/cart/clear/${userId}/${hotelId}`
);
            setStep(3);

          } catch (err) {
            console.log(err);
          }
        }
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.log(err);
    }
  };
const handleParcelBooking = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const payload = {
      userId: user?.id,
      hotelId,
      bookingDate: new Date().toISOString().split("T")[0],
      bookingTime: booking.time,
      persons: 1,
      status: "PENDING",
      type: "PARCEL"
    };

    const res = await axios.post(
      "http://localhost:8084/booking/create",
      payload
    );

    setBookingId(res.data.id);
    setStep(2);

  } catch (err) {
    console.log(err);
    alert("Parcel booking failed");
  }
};
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* STEP 0 */}
      {step === 0 && (
        <div className="p-8 bg-white rounded-xl shadow text-center">

          <h3 className="text-2xl font-bold mb-6">
            Choose Order Type
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <div
              onClick={() => {
                setBookingType("table");
                setStep(1);
              }}
              className="border p-6 rounded-xl cursor-pointer hover:bg-gray-50"
            >
              🍽️ Table Booking
              <p className="text-gray-500">Dine-in reservation</p>
            </div>

            <div
              onClick={() => {
                setBookingType("parcel");
                setStep(1);
              }}
              className="border p-6 rounded-xl cursor-pointer hover:bg-gray-50"
            >
              📦 Parcel
              <p className="text-gray-500">Takeaway order</p>
            </div>

          </div>
        </div>
      )}

      {/* STEP HEADER (UNCHANGED) */}
      {step > 0 && (
        <div className="flex justify-between items-center mb-12">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 ${
                step >= i + 1 ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= i + 1
                    ? "border-primary bg-primary/10"
                    : "border-gray-200"
                }`}
              >
                {step > i + 1 ? (
                  <Check className="w-5 h-5" />
                ) : (
                  React.cloneElement(s.icon, {
                    className: "w-5 h-5"
                  })
                )}
              </div>

              <span className="font-bold hidden sm:block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      
      {step === 1 && bookingType === "table" && (
        <div className="p-8 bg-white rounded-xl shadow">

          <h3 className="text-2xl font-bold mb-8">
            Table Reservation
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-8">

           
            <input
              type="date"
              className="input-field"
              onChange={(e) =>
                updateBooking({ date: e.target.value })
              }
            />

            <input
              type="time"
              className="input-field"
              onChange={(e) =>
                updateBooking({ time: e.target.value })
              }
            />

            <input
              type="number"
              className="input-field"
              value={booking.guests}
              onChange={(e) =>
                updateBooking({ guests: e.target.value })
              }
            />

          </div>

          <button
            onClick={handleTableNext}
            className="btn-primary w-full py-4"
          >
            Next
          </button>

        </div>
      )}

     
      {step === 1 && bookingType === "parcel" && (
        <div className="p-8 bg-white rounded-xl shadow">

          <h3 className="text-2xl font-bold mb-6">
            Parcel Pickup Time
          </h3>

      
          <input
            type="time"
            className="input-field mb-4"
            onChange={(e) =>
              updateBooking({ time: e.target.value })
            }
          />

          <button
            onClick={handleParcelBooking} // 🔥 UPDATED
            className="btn-primary w-full py-4"
          >
            Continue to Checkout
          </button>

        </div>
      )}

     
      {step === 2 && (
        <div className="p-8 bg-white rounded-xl shadow">

          <h3 className="text-2xl font-bold mb-6">
            Order Summary
          </h3>

          {cart.map((item) => (
            <div key={item.itemId} className="flex justify-between mb-2">
              <span>{item.itemName}</span>
              <span>
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <h4 className="font-bold text-lg">
            Total: ₹{total + bookingFee}
          </h4>

          <button
            onClick={handleFinalize}
            className="btn-primary w-full mt-4"
          >
            Pay Now
          </button>

        </div>
      )}

    
      {step === 3 && (
        <div className="text-center">

          <Check className="w-12 h-12 mx-auto text-green-500" />

          <h3 className="text-2xl font-bold mt-4">
            Order Confirmed 🎉
          </h3>

          <button
            onClick={() => navigate("/")}
            className="btn-primary mt-6"
          >
            Go Home
          </button>

        </div>
      )}

    </div>
  );
};

export default BookingFlow;