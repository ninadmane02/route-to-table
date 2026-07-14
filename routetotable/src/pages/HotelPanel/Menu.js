import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit2 } from "lucide-react";
import Sidebar from "./Sidebar";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [showCard, setShowCard] = useState(false); // ⭐ NEW
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);

  const [item, setItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    isVeg: true,
    available: true,
    imageUrl: ""
  });

  const [imageFile, setImageFile] = useState(null);

   const hotelId = localStorage.getItem("id");
   
 const hotelName = localStorage.getItem("name");
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    axios.get(`http://localhost:8083/menu/${hotelId}`)
      .then(res => setMenu(res.data));
  };


  const uploadImage = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "flutter_unsigned");
    formData.append("cloud_name", "dzqohamay");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dzqohamay/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  // ADD / UPDATE
  const saveItem = async () => {
    if (!item.name || !item.price) return alert("Fill Name & Price");

    setLoading(true);

    try {
      let imageUrl = item.imageUrl; 

    
    if (imageFile) {
      imageUrl = await uploadImage();
      
    }

      const payload = {
        ...item,
        hotelId,
        imageUrl
      };

      if (editId) {
       
        await axios.put(`http://localhost:8083/menu/update/${editId}`, payload);
      } else {
        await axios.post("http://localhost:8083/menu/add", payload);
      }

      fetchMenu();
      resetForm();

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setItem({
      name: "",
      price: "",
      description: "",
      category: "",
      isVeg: true,
      available: true,

    });
    setImageFile(null);
    setEditId(null);
    setShowForm(false);
  };

  const deleteItem = (id) => {
    axios.delete(`http://localhost:8083/menu/delete/${id}`)
      .then(fetchMenu);
  };

  // EDIT
  const handleEdit = (m) => {
    setItem({
      name: m.name,
      price: m.price,
      description: m.description,
      category: m.category,
      isVeg: m.isVeg,
      available: m.available,
      imageUrl: m.imageUrl
    });

    setEditId(m.id);
    setShowForm(true);
    setShowCard(false);
  };

  const filteredMenu = menu.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  
  const groupedMenu = menu.reduce((acc, item) => {
    const key = item.category || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar  hotelName={hotelName}/>

      <main className="flex-1 p-10" style={{marginLeft:"20%"}}>

        {/* HEADER */}
        <header className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            Cuisine Management
          </h2>

          <div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setShowCard(false);
              }}
              className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold"
            >
              {showForm ? "Close" : "+ Add Menu"}
            </button>

           
            <button
              onClick={() => {
                setShowCard(!showCard);
                setShowForm(false);
              }}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold ml-2"
            >
              🍽 Menu Card
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* FORM */}
          {showForm && (
            <div className="lg:col-span-12 flex justify-center">
              <div className="bg-white p-6 rounded-3xl shadow space-y-3">

                <input className="w-full bg-slate-50 px-4 py-3 rounded-xl"
                  placeholder="Dish Name"
                  value={item.name}
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                />

                <input type="number"
                  className="w-full bg-slate-50 px-4 py-3 rounded-xl"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => setItem({ ...item, price: e.target.value })}
                />

                <input className="w-full bg-slate-50 px-4 py-3 rounded-xl"
                  placeholder="Category"
                  value={item.category}
                  onChange={(e) => setItem({ ...item, category: e.target.value })}
                />

                <textarea className="w-full bg-slate-50 px-4 py-3 rounded-xl"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => setItem({ ...item, description: e.target.value })}
                />

                <input type="file"
                  className="w-full bg-slate-50 px-4 py-2 rounded-xl"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />

                <select className="w-full bg-slate-50 px-4 py-3 rounded-xl"
                  onChange={(e) => setItem({ ...item, isVeg: e.target.value === "true" })}>
                  <option value="true">Veg</option>
                  <option value="false">Non-Veg</option>
                </select>

                <select className="w-full bg-slate-50 px-4 py-3 rounded-xl"
                  onChange={(e) => setItem({ ...item, available: e.target.value === "true" })}>
                  <option value="true">Available</option>
                  <option value="false">Out of Stock</option>
                </select>

                <button
                  onClick={saveItem}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold"
                >
                  {loading ? "Saving..." : editId ? "Update Item" : "Add Item"}
                </button>

              </div>
            </div>
          )}

          {/* LIST */}
          {!showForm && !showCard && (
            <div className="lg:col-span-12 space-y-4">

              {/* SEARCH */}
              <div className="bg-white p-3 rounded-xl shadow border">
                <input
                  type="text"
                  placeholder="🔍 Search dish..."
                  className="w-full outline-none px-4 py-2 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* MENU LIST */}
              {filteredMenu.map((m) => (
                <div key={m.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">

                  <img
                    src={m.imageUrl}
                    className="w-20 h-20 object-cover rounded-xl"
                    alt=""
                  />

                  <div className="flex-1">
                    <h4 className="font-bold">{m.name}</h4>
                    <p className="text-sm text-gray-500">{m.category}</p>
                    <p className="font-semibold">₹{m.price}</p>
                  </div>

                  <button onClick={() => handleEdit(m)} className="text-blue-500">
                    <Edit2 size={18} />
                  </button>

                  <button onClick={() => deleteItem(m.id)} className="text-red-500">
                    <Trash2 size={18} />
                  </button>

                </div>
              ))}
            </div>
          )}

          {/* MENU CARD VIEW */}
          {showCard && (
            <div className="lg:col-span-12">
              <div className="bg-white p-10 rounded-3xl shadow max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold text-center mb-6">
                  🍽 Restaurant Menu Card
                </h1>

                {Object.entries(groupedMenu).map(([category, items]) => (
                  <div key={category} className="mb-6">

                    <h2 className="text-orange-500 font-bold border-b pb-2 mb-3">
                      {category}
                    </h2>

                    {items.map((m) => (
                      <div key={m.id} className="flex justify-between py-2">

                        <div>
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-sm text-gray-500">{m.description}</p>
                        </div>

                        <p className="font-bold">₹{m.price}</p>

                      </div>
                    ))}

                  </div>
                ))}

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Menu;