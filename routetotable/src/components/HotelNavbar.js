import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  LogOut,
  User,
  ShoppingCart,
  ClipboardList,
  Calendar,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;


  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between h-16 items-center">

          
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <MapPin className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-secondary">
              RouteTo<span className="text-primary">Table</span>
            </span>
          </Link>

          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/discovery" className="text-gray-600 hover:text-primary font-medium">
              Find Route
            </Link>
          </div>

        
          <div className="flex items-center gap-4">

            {!user ? (
              <div className="flex gap-3" style={{ alignItems: "center" }}>
                <Link to="/login" className="text-gray-600">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </div>
            ) : role === "traveler" ? (
              <div className="relative">

                
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  <User size={18} />
                  <span className="hidden sm:block">
                    {user.name}
                  </span>
                  <ChevronDown size={16} />
                </button>

               
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">

                     <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      <User size={16} /> Profile
                    </Link>

                 
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      <ClipboardList size={16} /> Orders
                    </Link>
                    <Link
                      to="/waitlist"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      <ClipboardList size={16} /> Waitlist
                    </Link>

                    <hr />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 w-full"
                    >
                      <LogOut size={16} /> Logout
                    </button>

                  </div>
                )}

              </div>
            ): <div className="flex gap-3" style={{ alignItems: "center" }}>
                <Link to="/login" className="text-gray-600">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </div>}

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;