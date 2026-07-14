import React, { useEffect, useState } from "react";
import axios from "axios";

const MenuCard = () => {
  const [menu, setMenu] = useState([]);

  const hotelId = 1;

  useEffect(() => {
    axios.get(`http://localhost:8083/menu/${hotelId}`)
      .then(res => setMenu(res.data));
  }, []);

  // group by category
  const groupedMenu = menu.reduce((acc, item) => {
    const key = item.category || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center">

      {/* MENU CARD */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl p-10">

        {/* HEADER */}
        <div className="text-center border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold">🍽️ Restaurant Menu</h1>
          <p className="text-gray-500">Fresh & Delicious Food</p>
        </div>

        {/* MENU ITEMS */}
        {Object.keys(groupedMenu).map((category) => (
          <div key={category} className="mb-8">

            <h2 className="text-xl font-bold text-orange-500 border-b pb-2 mb-4">
              {category}
            </h2>

            {groupedMenu[category].map((item) => (
              <div key={item.id} className="flex justify-between mb-4">

                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {item.name}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.isVeg ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {item.isVeg ? "Veg" : "Non-Veg"}
                    </span>
                  </h3>

                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>

                <div className="font-bold text-gray-800">
                  ₹{item.price}
                </div>

              </div>
            ))}

          </div>
        ))}

        {/* FOOTER */}
        <div className="text-center border-t pt-6 text-gray-500 text-sm">
          Thank you for visiting ❤️
        </div>

      </div>
    </div>
  );
};

export default MenuCard;