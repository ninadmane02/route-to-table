import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Calendar,
  ClipboardList,
  Table,
  User,
  LogOut
} from "lucide-react";

const Sidebar = ({hotelName}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItemStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
     ${
       isActive
         ? "bg-orange-500 text-white shadow-md"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4" style={{position:"fixed",height:"100vh"}}>

      {/* HEADER */}
      <div className="mb-8 px-3">
        <h2 className="text-xl font-bold">🏨 {hotelName || "Hotel Panel"}</h2>
<p className="text-xs text-gray-400">Management System</p>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-2 flex-1">

        <NavLink to="/hotel/dashboard" className={menuItemStyle}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/hotel/menu" className={menuItemStyle}>
          <Utensils size={18} />
          Menu
        </NavLink>

        <NavLink to="/hotel/bookings" className={menuItemStyle}>
          <Calendar size={18} />
          Bookings
        </NavLink>

        <NavLink to="/hotel/orders" className={menuItemStyle}>
          <ClipboardList size={18} />
          Orders
        </NavLink>

        <NavLink to="/hotel/tables" className={menuItemStyle}>
          <Table size={18} />
          Tables
        </NavLink>

        <NavLink to="/hotel/profile" className={menuItemStyle}>
          <User size={18} />
          Profile
        </NavLink>

      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition"
      >
        <LogOut size={18} />
        Logout
      </button>

    </div>
  );
};

export default Sidebar;