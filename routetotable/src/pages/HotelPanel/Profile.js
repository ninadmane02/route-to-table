import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { User, Mail, MapPin, Phone, Building } from "lucide-react";

const HotelProfile = () => {
  const hotelId = localStorage.getItem("id");
  const hotelName = localStorage.getItem("name");

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [hotel, setHotel] = useState({
    h_name: "",
    h_contact: "",
    h_email: "",
    h_city: "",
    h_address: "",
    cuisineType: "",
    openingTime: "",
    closingTime: "",
    priceCategory: ""
  });

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/hotel/${hotelId}`
      );
      setHotel(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getLatLngFromAddress = async (address) => {
  const res = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        limit: 1
      }
    }
  );

  if (!res.data.length) {
    throw new Error("Location not found");
  }

  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon)
  };
};

  const handleChange = (e) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

 const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let updatedHotel = { ...hotel };

    
    if (hotel.h_address) {
      const location = await getLatLngFromAddress(
        `${hotel.h_address}, ${hotel.h_city}`
      );

      updatedHotel.latitude = location.lat;
      updatedHotel.longitude = location.lng;
    }

    await axios.put(
      `http://localhost:8082/hotel/update/${hotelId}`,
      updatedHotel
    );

    alert("Profile updated successfully");
    setEditMode(false);

  } catch (err) {
    console.log(err);
    alert("Update failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar hotelName={hotelName} />

      <main className="flex-1 p-10" style={{marginLeft:"20%"}}>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">🏨 Hotel Profile</h2>

          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow p-8">
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NAME */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Hotel Name</label>
              <div className="relative">
                <Building className="absolute left-2 top-3 text-gray-400" />
                <input
                  name="h_name"
                  value={hotel.h_name}
                  disabled={!editMode}
                  onChange={handleChange}
                  className="w-full border p-3 pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <label className="text-sm font-medium">Contact</label>
              <div className="relative">
                <Phone className="absolute left-2 top-3 text-gray-400" />
                <input
                  name="h_contact"
                  value={hotel.h_contact}
                  disabled={!editMode}
                  onChange={handleChange}
                  className="w-full border p-3 pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-2 top-3 text-gray-400" />
                <input
                  name="h_email"
                  value={hotel.h_email}
                  disabled={!editMode}
                  onChange={handleChange}
                  className="w-full border p-3 pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* CITY */}
            <div>
              <label className="text-sm font-medium">City</label>
              <div className="relative">
                <MapPin className="absolute left-2 top-3 text-gray-400" />
                <input
                  name="h_city"
                  value={hotel.h_city}
                  disabled={!editMode}
                  onChange={handleChange}
                  className="w-full border p-3 pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm font-medium">Address</label>
              <input
                name="h_address"
                value={hotel.h_address}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* CUISINE */}
            <div>
              <label className="text-sm font-medium">Cuisine Type</label>
              <input
                name="cuisineType"
                value={hotel.cuisineType}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* OPENING */}
            <div>
              <label className="text-sm font-medium">Opening Time</label>
              <input
                type="time"
                name="openingTime"
                value={hotel.openingTime}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* CLOSING */}
            <div>
              <label className="text-sm font-medium">Closing Time</label>
              <input
                type="time"
                name="closingTime"
                value={hotel.closingTime}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* PRICE CATEGORY */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Price Category</label>
              <select
                name="priceCategory"
                value={hotel.priceCategory}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* BUTTON */}
            {editMode && (
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex justify-center items-center gap-2"
                >
                  {loading && (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default HotelProfile;