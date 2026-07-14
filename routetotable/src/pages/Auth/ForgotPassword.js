import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock } from "lucide-react";

const ForgotPassword = () => {

  const [role, setRole] = useState("traveler");
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifyotp, setVerifyotp] = useState(0);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getBaseUrl = () => {
    return role === "hotel"
      ? "http://localhost:8082/hotel"
      : "http://localhost:8081/user";
  };

 
  const sendOtp = async () => {
    try {
      if (role === "hotel") {
        await axios.post(`http://localhost:8082/hotel/send-otp`, {
          h_email: email
        }).then(res=>{
          
          localStorage.setItem("otp",res.data);

         
        });
      } else {
        await axios.post(`http://localhost:8081/user/send-otp`, {
          u_email: email
        }).then(res=>{

          localStorage.setItem("otp",res.data);
        });
      }

      alert("OTP sent successfully");
      setStep(2);

    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  
const verifyOtp = async () => {
  try {
   
const generateOTP=localStorage.getItem("otp");
    if (generateOTP === otp) {
      alert("OTP Verified");
      setStep(3);
    } else {
      alert("Invalid OTP");
    }

  } catch (err) {
    alert("OTP verification failed");
  }
};

  
  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      if (role === "hotel") {
      await axios.post(`${getBaseUrl()}/reset-password`, {
        h_email:email,
      
      h_password:  newPassword
      });
    }else{
      await axios.post(`${getBaseUrl()}/reset-password`, {
        u_email:email,
      
      u_password:  newPassword
      });
    }
      alert("Password updated successfully");

      // reset all
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gray-50 flex items-center justify-center">

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">

       
        <h2 className="text-3xl font-bold text-center text-secondary mb-8">
          Forgot Password
        </h2>

       
        <div className="flex p-1 bg-gray-100 rounded-lg mb-8">

          <button
            onClick={() => setRole("traveler")}
            className={`flex-1 py-2 rounded-md font-medium ${
              role === "traveler"
                ? "bg-white shadow text-primary"
                : "text-gray-500"
            }`}
          >
            I'm a Traveler
          </button>

          <button
            onClick={() => setRole("hotel")}
            className={`flex-1 py-2 rounded-md font-medium ${
              role === "hotel"
                ? "bg-white shadow text-primary"
                : "text-gray-500"
            }`}
          >
            I'm a Hotelier
          </button>

        </div>

       
        {step === 1 && (
          <div className="space-y-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  className="w-full border rounded-lg py-3 pl-9 pr-4"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={sendOtp}
              className="btn-primary w-full py-3"
            >
              Send OTP
            </button>

          </div>
        )}

       
        {step === 2 && (
          <div className="space-y-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                className="w-full border rounded-lg py-3 px-4"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={verifyOtp}
              className="btn-primary w-full py-3"
            >
              Verify OTP
            </button>

          </div>
        )}

       
        {step === 3 && (
          <div className="space-y-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>

              <div className="relative">
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="password"
                  className="w-full border rounded-lg py-3 pl-9 pr-4"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="password"
                  className="w-full border rounded-lg py-3 pl-9 pr-4"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={resetPassword}
              className="btn-primary w-full py-3"
            >
              Reset Password
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;