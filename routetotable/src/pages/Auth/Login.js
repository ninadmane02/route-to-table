import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";




const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('traveler');
  const [user, setUser] = useState({})
  const [credentials, setCredentials] = useState({});
  const [showPassword, setShowPassword] = useState(false);
 const handleSubmit = (e) => {
  e.preventDefault();

 
  if (
    credentials.email === "admin@gmail.com" &&
    credentials.password === "admin123"
  ) {
    localStorage.setItem("role", "admin");
    localStorage.setItem("token","admintoen");
    navigate("/admin");
    return;
  }

  let url = "";
  let payload = {};

  if (role === "hotel") {
    url = "http://localhost:8082/hotel/loginHotel";
    payload = {
      h_email: credentials.email,
      h_password: credentials.password
    };
  } else {
    url = "http://localhost:8081/user/loginUser";
    payload = {
      u_email: credentials.email,
      u_password: credentials.password
    };
  }

  axios.post(url, payload)
    .then(res => {
      const data = res.data;

      if (data.token) {
       const userObj = {
  token: data.token,
  name: data.name,
  email: data.email,
  role: data.role,
  id:data.id
};
localStorage.setItem("token",data.token);
localStorage.setItem("user", JSON.stringify(userObj));
localStorage.setItem("role", data.role);
localStorage.setItem("id", data.id);
localStorage.setItem("name", data.name);
        alert("Login Successfully");
        navigate(role === "hotel" ? "/hotel/dashboard" : "/");
      } else {
        alert("Login Failed");
      }
    })
    .catch(() => {
      alert("Invalid email or password");
    });
};

  return (
    
    <div className="min-h-screen py-20 px-4 bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-secondary mb-8">Welcome Back</h2>

        <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
          <button
            onClick={() => setRole('traveler')}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${role === 'traveler' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
          >
            I'm a Traveler
          </button>
          <button
            onClick={() => setRole('hotel')}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${role === 'hotel' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
          >
            I'm a Hotelier
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                required
                className="w-full border rounded-lg py-3 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
                onChange={(e) => {
                  setCredentials({
                    ...credentials,
                    email: e.target.value
                  });
                }}
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

              {/* Input */}
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full border rounded-lg py-3 pl-9 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => {
                  setCredentials({
                    ...credentials,
                    password: e.target.value
                  });
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3">
            <LogIn className="w-5 h-5" />
            Sign In
          </button>

        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-primary font-bold">Sign Up</Link>
        </p>
        <button
  onClick={() => navigate("/forgotPassword")}
  className="w-full mt-4 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition"
>
  Forgot Password
</button>
      </div>
    </div>
  );
};

export default Login;
