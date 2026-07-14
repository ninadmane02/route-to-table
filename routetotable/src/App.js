import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ NEW

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import RouteSearch from './pages/Discovery/RouteSearch';
import HotelDetails from './pages/Hotel/HotelDetails';
import BookingFlow from './pages/Hotel/BookingFlow';
import WaitingListStatus from './pages/Hotel/WaitingListStatus';

// Panels
import OwnerDashboard from './pages/Dashboard/OwnerDashboard';
import Dashboard from './pages/HotelPanel/Dashboard';
import Menu from './pages/HotelPanel/Menu';
import Bookings from './pages/HotelPanel/Booking';
import Orders from './pages/HotelPanel/Orders';
import HotelNavbar from './components/HotelNavbar';
import Tables from './pages/HotelPanel/Tables';
import MenuPage from './pages/Hotel/MenuCardUser';
import { Sidebar } from 'lucide-react';
import HotelProfile from './pages/HotelPanel/Profile';

import ReviewPage from './pages/Hotel/ReviewPage';
import ForgotPassword from './pages/Auth/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import UserProfile from './pages/User/UserProfile';
import UserOrders from './pages/User/UserOrder';
import UserWaitlistPage from './pages/User/UserWaitlist';




function App() {

  const role = localStorage.getItem("role");

const getNavbar = (user) => {
  if (!user) return <HotelNavbar />;

  if (user.role === "hotel") return <Navbar />;

  if (user.role === "admin") return <Navbar />; 

  if (user.role === "traveler") return <Navbar />;

  return <Navbar />;
};
  return (
   
    <BookingProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
       {getNavbar()}
          
         

          <div className="flex-grow">
            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />

              {/* Traveler */}
              <Route
                path="/discovery"
                element={
                  
                    <RouteSearch />
                
                }
              />
               <Route
                path="/profile"
                element={
                  
                    <UserProfile />
                
                }
              />
               <Route
                path="/orders"
                element={
                  
                    <UserOrders />
                
                }
              />
              <Route
                path="/waitlist"
                element={
                  
                    <UserWaitlistPage />
                
                }
              />
               

               <Route
                path="/hotel/:id"
                element={
                  
                    <HotelDetails />
                
                }
              />

               <Route
                path="/review/:id"
                element={
                  <ProtectedRoute role="traveler">
                    <ReviewPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hotel/:id"
                element={
                  <ProtectedRoute role="traveler">
                    <HotelDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/booking"
                element={
                 
                    <BookingFlow />
                  
                }
              />

              <Route
                path="/waiting-status"
                element={
                  <ProtectedRoute role="traveler">
                    <WaitingListStatus />
                  </ProtectedRoute>
                }
              />

              {/* Hotel Panel */}
              <Route
                path="/hotel/dashboard"
                element={
                  <ProtectedRoute role="hotel">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hotel/menu"
                element={
                  <ProtectedRoute role="hotel">
                    <Menu />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/hotel/menu/:id"
                element={
                  
                    <MenuPage />
                 
                }
              />

              <Route
                path="/hotel/bookings"
                element={
                  <ProtectedRoute role="hotel">
                    <Bookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hotel/orders"
                element={
                  <ProtectedRoute role="hotel">
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotel/tables"
                element={
                  <ProtectedRoute role="hotel">
                    <Tables />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hotel/profile"
                element={
                  <ProtectedRoute role="hotel">
                    <HotelProfile />
                  </ProtectedRoute>
                }
              />

              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Default */}
              <Route path="*" element={<Login />} />

            </Routes>
          </div>

          <footer className="bg-secondary text-gray-400 py-12 px-4 border-t border-gray-800">
            <div className="max-w-7xl mx-auto text-center">
              <p>&copy; 2026 RouteToTable Inc. All rights reserved.</p>
              <p className="mt-2 text-sm">
                Empowering travelers and restaurants world-wide.
              </p>
            </div>
          </footer>

        </div>
      </Router>
    </BookingProvider>
   
  );
}

export default App;