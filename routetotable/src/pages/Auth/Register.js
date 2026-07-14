import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, MapPin, Phone } from 'lucide-react';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('traveler');
  const [showPassword, setShowPassword] = useState(false);
  // Traveler State
  const [user, setUser] = useState({
    u_name: '',
    u_mobile: '',
    u_email: '',
    u_password: '',
    city: ''
  });

  // Hotel State
  const [hotel, setHotel] = useState({
    h_name: '',
    h_contact: '',
    h_email: '',
    h_password: '',
    h_city: '',
    h_address: '',
    cuisineType: '',
    openingTime: '',
    closingTime: '',
    latitude: '',
    longitude: '',
    priceCategory: '',
    rating: 0

  });

   const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'traveler') {
       setLoading(true);
      axios.post("http://localhost:8081/user/registerUser", user)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.message) {
            alert(err.response.data.message);
             navigate('/login');
          } else {
            alert("Something went wrong!");
          }
        }). finally(() => {
      setLoading(false);
    });;
    } else {
 setLoading(true);
      try {
        const fullAddress = `${hotel.h_address}, ${hotel.h_city}`;


        const geoRes = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: fullAddress,
              key: "AIzaSyAMj31HCM1vRrqxrfRnAEK9WQwOnxYpQ0E",
            }
          }
        );

        const location = geoRes.data.results[0].geometry.location;

        const hotelData = {
          ...hotel,
          latitude: location.lat,
          longitude: location.lng
        };

        axios.post("http://localhost:8082/hotel/registerHotel", hotelData)
          .then((res) => {
            if (res.data.status === "success") {
              alert(res.data.message);
              navigate('/login');
            } else {
              alert(res.data.message);
            }
          })
          .catch(() => {
            alert("Something went wrong!");
          });
      } catch (error) {
        console.error(error);
        alert("Error fetching location");
      }finally{
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gray-50 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-center text-secondary mb-2">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Join the RouteToTable network today.
        </p>

      
        <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
          <button
            onClick={() => setRole('traveler')}
            className={`flex-1 py-2 rounded-md ${role === 'traveler' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
          >
            Join as Traveler
          </button>
          <button
            onClick={() => setRole('hotel')}
            className={`flex-1 py-2 rounded-md ${role === 'hotel' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
          >
            Register my Hotel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

         
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {role === 'traveler' ? 'Full Name' : 'Hotel Name'}
            </label>
            <div className="relative">
              {role === 'traveler'
                ? <User className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                : <Building className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />}
              <input
                type="text"
                required
                placeholder={role === 'traveler' ? 'Enter your full name' : 'Enter hotel name'}
                className="w-full border rounded-lg py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  role === 'traveler'
                    ? setUser({ ...user, u_name: e.target.value })
                    : setHotel({ ...hotel, h_name: e.target.value })
                }
              />
            </div>
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {role === 'traveler' ? 'Mobile Number' : 'Hotel Contact'}
            </label>
            <div className="relative">
              <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                required
                placeholder="Enter your Mobile Number"
                className="w-full border rounded-lg py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  role === 'traveler'
                    ? setUser({ ...user, u_mobile: e.target.value })
                    : setHotel({ ...hotel, h_contact: e.target.value })
                }
              />
            </div>
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {role === 'traveler' ? 'City' : 'Hotel City'}
            </label>
            <div className="relative">
              <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

              <input
                type="text"
                placeholder="Enter your city"
                className="w-full border rounded-lg py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  role === 'traveler'
                    ? setUser({ ...user, city: e.target.value })
                    : setHotel({ ...hotel, h_city: e.target.value })
                }
              />
            </div>
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                placeholder='Enter your Email'
                required
                className="w-full border rounded-lg py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  role === 'traveler'
                    ? setUser({ ...user, u_email: e.target.value })
                    : setHotel({ ...hotel, h_email: e.target.value })
                }
              />
            </div>
          </div>

       
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
           
              <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

              
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>

             
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                required
                className="w-full border rounded-lg py-3 pl-9 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  role === 'traveler'
                    ? setUser({ ...user, u_password: e.target.value })
                    : setHotel({ ...hotel, h_password: e.target.value })
                }
              />
            </div>
          </div>

          {role === 'hotel' && (
            <>
              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Enter full hotel address"
                    className="w-full border rounded-lg py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) =>
                      setHotel({ ...hotel, h_address: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Cuisine */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type
                </label>
                <div className="relative">
                  <Building className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Indian, Chinese, Multi-cuisine"
                    className="w-full border rounded-lg py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) =>
                      setHotel({ ...hotel, cuisineType: e.target.value })
                    }
                  />
                </div>
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Time
                </label>
                <input
                  type="time"
                  className="input-field w-full"
                  onChange={(e) =>
                    setHotel({ ...hotel, openingTime: e.target.value })
                  }
                />
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing Time
                </label>
                <input
                  type="time"
                  className="input-field w-full"
                  onChange={(e) =>
                    setHotel({ ...hotel, closingTime: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Category
                </label>

                <select
                  required
                  className="w-full border rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) =>
                    setHotel({ ...hotel, priceCategory: e.target.value })
                  }
                >
                  <option value="">Select Price Category</option>
                  <option value="low">Low </option>
                  <option value="medium">Medium </option>
                  <option value="high">High</option>
                </select>
              </div>
            </>
          )}


          <div className="md:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;