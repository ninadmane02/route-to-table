import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Building2,
  Ban,
  CheckCircle,
  TrendingUp,
  Shield,
  Search,
  Activity,
} from "lucide-react";

const OwnerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchHotels();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8081/user/all");
    setUsers(res.data);
  };

  const fetchHotels = async () => {
    const res = await axios.get("http://localhost:8082/hotel/all");
    setHotels(res.data);
  };

  const toggleUserStatus = async (id, status) => {
    await axios.put(
      `http://localhost:8081/user/status/${id}?status=${status}`
    );
    fetchUsers();
  };

  const toggleHotelStatus = async (id, status) => {
    await axios.put(
      `http://localhost:8082/hotel/status/${id}?status=${status}`
    );
    fetchHotels();
  };

  
  const filteredUsers = users.filter(
    (u) =>
      u.u_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.u_email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHotels = hotels.filter(
    (h) =>
      h.h_name?.toLowerCase().includes(search.toLowerCase()) ||
      h.h_city?.toLowerCase().includes(search.toLowerCase())
  );

  // STATS
  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <Users />,
      color: "blue",
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status !== "BLOCKED").length,
      icon: <CheckCircle />,
      color: "green",
    },
    {
      label: "Blocked Users",
      value: users.filter((u) => u.status === "BLOCKED").length,
      icon: <Ban />,
      color: "red",
    },
    {
      label: "Total Hotels",
      value: hotels.length,
      icon: <Building2 />,
      color: "purple",
    },
    {
      label: "Active Hotels",
      value: hotels.filter((h) => h.status !== "BLOCKED").length,
      icon: <TrendingUp />,
      color: "green",
    },
    {
      label: "Blocked Hotels",
      value: hotels.filter((h) => h.status === "BLOCKED").length,
      icon: <Shield />,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

     
      <aside className="w-64 bg-secondary text-white hidden lg:block" style={{position:"fixed",height:"100vh"}}>
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">
            RouteTo<span className="text-primary">Table</span>
          </h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: <Activity /> },
            { id: "users", label: "Users", icon: <Users /> },
            { id: "hotels", label: "Hotels", icon: <Building2 /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? "bg-primary text-white"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6" style={{marginLeft:"20%"}}>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-secondary">
            Admin Dashboard
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search users / hotels..."
              className="input-field pl-9 w-64"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* OVERVIEW (Hotel-style cards) */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="card p-6 flex items-center justify-between"
                >
                  <div>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                    <h2 className="text-2xl font-bold text-secondary">
                      {s.value}
                    </h2>
                  </div>
                  <div className="text-primary">{s.icon}</div>
                </div>
              ))}
            </div>

            {/* EXTRA FEATURE CARD */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-2">
                🚀 System Insights
              </h2>
              <p className="text-gray-500">
                Monitor users, hotels, and system health in real time.
              </p>
            </div>
          </>
        )}

       
        {activeTab === "users" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u) => (
              <div key={u.u_id} className="card p-5">
                <h3 className="text-lg font-bold">{u.u_name}</h3>
                <p className="text-gray-500 text-sm">{u.u_email}</p>
                <p className="text-gray-500 text-sm">{u.u_mobile}</p>

                <span
                  className={`inline-block mt-3 px-2 py-1 text-xs rounded ${
                    u.status === "BLOCKED"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {u.status || "ACTIVE"}
                </span>

                <div className="mt-4 flex gap-2">
                  {u.status === "BLOCKED" ? (
                    <button
                      onClick={() => toggleUserStatus(u.u_id, "ACTIVE")}
                      className="btn-primary text-sm"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleUserStatus(u.u_id, "BLOCKED")}
                      className="btn-secondary text-sm"
                    >
                      Block
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      
        {activeTab === "hotels" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((h) => (
              <div key={h.h_id} className="card p-5">
                <h3 className="text-lg font-bold">{h.h_name}</h3>
                <p className="text-gray-500 text-sm">{h.h_email}</p>
                <p className="text-gray-500 text-sm">{h.h_city}</p>

                <span
                  className={`inline-block mt-3 px-2 py-1 text-xs rounded ${
                    h.status === "BLOCKED"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {h.status || "ACTIVE"}
                </span>

                <div className="mt-4 flex gap-2">
                  {h.status === "BLOCKED" ? (
                    <button
                      onClick={() => toggleHotelStatus(h.h_id, "ACTIVE")}
                      className="btn-primary text-sm"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleHotelStatus(h.h_id, "BLOCKED")}
                      className="btn-secondary text-sm"
                    >
                      Block
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;