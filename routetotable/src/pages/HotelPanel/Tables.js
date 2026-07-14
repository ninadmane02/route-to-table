import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Eye, EyeOff, Plus, Trash2, Edit } from "lucide-react";

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [openTableId, setOpenTableId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    tableNumber: "",
    capacity: "",
    status: "AVAILABLE",
  });

  const hotelId = localStorage.getItem("id");
  const hotelName = localStorage.getItem("name");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const res = await axios.get(
      `http://localhost:8085/table/${hotelId}`
    );
    setTables(res.data);
  };

  const toggleDetails = (id) => {
    setOpenTableId(openTableId === id ? null : id);
  };

  const openAddForm = () => {
    setIsEdit(false);
    setForm({
      id: null,
      tableNumber: "",
      capacity: "",
      status: "AVAILABLE",
    });
    setShowForm(true);
  };

  const openEditForm = (table) => {
    setIsEdit(true);
    setForm(table);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      hotelId: hotelId,
    };

    if (isEdit) {
      await axios.put(
        `http://localhost:8085/table/update/${form.id}`,
        payload
      );
    } else {
      await axios.post(`http://localhost:8085/table/add`, payload);
    }

    setShowForm(false);
    fetchTables();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8085/table/delete/${id}`);
    fetchTables();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar hotelName={hotelName} />

      <main className="flex-1 p-10 ml-[20%]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">🪑 Tables</h2>

          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            <Plus size={18} />
            Add Table
          </button>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((t) => {
            const statusStyle =
              t.status === "AVAILABLE"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600";

            return (
              <div
                key={t.id}
                className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-gray-400">ID #{t.id}</p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle}`}
                  >
                    {t.status}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold">
                    🍽 Table {t.tableNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Capacity: {t.capacity} people
                  </p>
                </div>

                {/* TOGGLE */}
                <button
                  onClick={() => toggleDetails(t.id)}
                  className="flex items-center justify-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                >
                  {openTableId === t.id ? (
                    <>
                      <EyeOff size={16} /> Hide Details
                    </>
                  ) : (
                    <>
                      <Eye size={16} /> View Details
                    </>
                  )}
                </button>

                {/* DETAILS */}
                {openTableId === t.id && (
                  <div className="mt-3 text-sm bg-gray-50 p-3 rounded-xl text-gray-600">
                    Status: {t.status}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => openEditForm(t)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-[400px] shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                {isEdit ? "Update Table" : "Add Table"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="number"
                  name="tableNumber"
                  placeholder="Table Number"
                  value={form.tableNumber}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />

                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BOOKED">BOOKED</option>
                </select>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {isEdit ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tables;