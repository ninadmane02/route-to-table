import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Edit3, Save } from "lucide-react";

const UserProfile = () => {
  const userId = localStorage.getItem("id");

  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await axios.get(`http://localhost:8081/user/${userId}`);
    setUser(res.data);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    await axios.put(`http://localhost:8081/user/update/${userId}`, user);
    setEdit(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3">

        {/* LEFT PROFILE PANEL */}
        <div className="bg-primary text-white p-8 flex flex-col items-center justify-center">
          
          <div className="w-24 h-24 rounded-full bg-white text-primary flex items-center justify-center text-3xl font-bold shadow-lg">
            {user.u_name ? user.u_name.charAt(0).toUpperCase() : "U"}
          </div>

          <h2 className="text-2xl font-bold mt-4">
            {user.u_name || "User Name"}
          </h2>

          <p className="text-sm opacity-80">{user.u_email}</p>

          <div className="mt-6 text-center text-sm opacity-90">
            <p>📍 {user.city || "No city set"}</p>
            <p>📞 {user.u_mobile || "No mobile"}</p>
          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="mt-6 bg-white text-primary px-5 py-2 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition"
          >
            <Edit3 size={16} />
            {edit ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="col-span-2 p-10">

          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Profile Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NAME */}
            <div className="border rounded-xl p-3 flex items-center gap-3">
              <User className="text-gray-400" />
              <input
                name="u_name"
                value={user.u_name || ""}
                disabled={!edit}
                onChange={handleChange}
                className="w-full outline-none"
                placeholder="Name"
              />
            </div>

            {/* EMAIL */}
            <div className="border rounded-xl p-3 flex items-center gap-3 bg-gray-100">
              <Mail className="text-gray-400" />
              <input
                name="u_email"
                value={user.u_email || ""}
                disabled
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* MOBILE */}
            <div className="border rounded-xl p-3 flex items-center gap-3">
              <Phone className="text-gray-400" />
              <input
                name="u_mobile"
                value={user.u_mobile || ""}
                disabled={!edit}
                onChange={handleChange}
                className="w-full outline-none"
                placeholder="Mobile"
              />
            </div>

            {/* CITY */}
            <div className="border rounded-xl p-3 flex items-center gap-3">
              <MapPin className="text-gray-400" />
              <input
                name="city"
                value={user.city || ""}
                disabled={!edit}
                onChange={handleChange}
                className="w-full outline-none"
                placeholder="City"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          {edit && (
            <button
              onClick={updateProfile}
              className="mt-8 bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition"
            >
              <Save size={18} />
              Save Changes
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;