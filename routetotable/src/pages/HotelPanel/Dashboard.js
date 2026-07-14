import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  CalendarCheck,
  Utensils,
  IndianRupee,
  Star,
  TrendingUp
} from "lucide-react";
import Performance from "./Performance";

const Dashboard = () => {
  const [data, setData] = useState({
    hotelName: "Loading...",
    bookings: 0,
    orders: 0,
    earnings: 0,
    rating: 0
  });

  useEffect(() => {
    const hotelId = localStorage.getItem("id");

    if (hotelId) {
      fetchAllData(hotelId);
    }
  }, []);

  const fetchAllData = async (hotelId) => {
    try {
      
      const [hotelRes, bookingRes, orderRes] = await Promise.all([
        axios.get(`http://localhost:8082/hotel/${hotelId}`),
        axios.get(`http://localhost:8084/booking/hotel/${hotelId}`),
        axios.get(`http://localhost:8087/order/hotel/${hotelId}`)
      ]);

      const hotel = hotelRes.data;
      const bookings = bookingRes.data || [];
      const orders = orderRes.data || [];

     
      const earnings = orders.reduce((sum, o) => {

  let amount = o.amount || 0;

 
  if (o.status === "REFUNDED") {

    if (o.type === "parcel") {
      amount = amount * 0.05;   
    }

    else if (o.type === "table") {
      amount = amount * 0.02;   
    }

    else {
      amount = 0; 
    }
  }

  
  return sum + amount;

}, 0);
      setData({
        hotelName: hotel.h_name,
        bookings: bookings.length,
        orders: orders.length,
        earnings: earnings,
        rating: hotel.rating || 4.2
      });

    } catch (err) {
      console.error("Dashboard API error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

    
      <Sidebar hotelName={data.hotelName} />

     
      <div className="flex-1 p-8" style={{marginLeft:"20%"}}>

       
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800">
              Hotel Dashboard
            </h1>
            <p className="text-gray-500">
              Welcome back, {data.hotelName}
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl border flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold">Live</span>
          </div>
        </header>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            label="Bookings"
            value={data.bookings}
            icon={<CalendarCheck className="text-blue-600" />}
          />

          <StatCard
            label="Orders"
            value={data.orders}
            icon={<Utensils className="text-orange-600" />}
          />

          <StatCard
            label="Earnings"
            value={`₹${data.earnings}`}
            icon={<IndianRupee className="text-green-600" />}
          />

          <StatCard
            label="Rating"
            value={data.rating}
            icon={<Star className="text-yellow-500" />}
          />

        </div>

       
      <div className="mt-10 bg-white p-8 rounded-3xl border shadow-sm">

  <div className="flex justify-between mb-6">
    <h3 className="text-xl font-bold">Performance</h3>
    <TrendingUp />
  </div>


  <Performance />

</div>

      </div>
    </div>
  );
};


const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
    <div>{icon}</div>

    <p className="text-xs uppercase text-gray-400 mt-4">{label}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default Dashboard;