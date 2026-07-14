import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";

const MenuPage = () => {
  const { id } = useParams();

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  
  useEffect(() => {
    fetchMenu();
    fetchCart();
  }, []);



const navigate = useNavigate();

// on checkout button
const handleCheckout = () => {
  if (!cart || cart.length === 0) {
    alert("Your cart is empty. Please add items before checkout.");
    return;
  }

  const hotelId = cart[0].hotelId;

  navigate("/booking", {
    state: { cart, hotelId }
  });
};

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`http://localhost:8083/menu/${id}`);
      setMenu(res.data);
      console.log(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8086/cart/${user.id}/${id}`
      );
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addToCart = async (item) => {
    try {
      await axios.post("http://localhost:8086/cart/add", {
        userId: user.id,
        hotelId: id,
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        quantity: 1
      });

      fetchCart(); // refresh UI
    } catch (err) {
      console.log(err);
    }
  };

  
  const decreaseQty = async (itemId) => {
    try {
      await axios.delete(
        `http://localhost:8086/cart/remove?userId=${user.id}&itemId=${itemId}`
      );

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };


  const groupedMenu = menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

    
      <div className="bg-white shadow-md sticky top-0 z-10 px-6 py-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          🍽️ Restaurant Menu
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore dishes and add your favorites to cart
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

     
        <div className="lg:col-span-2 space-y-10">

          {Object.keys(groupedMenu).map((category) => (
            <div key={category}>

              <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-blue-600 pl-3">
                {category}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">

                {groupedMenu[category].map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-200 p-5 border border-gray-100"
                  >

                    <h4 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h4>
                    <p
  className={`text-sm mt-1 font-medium ${
    item.available ? "text-green-600" : "text-red-500"
  }`}
>
  {item.available ? "Available" : "Out of Stock"}
</p>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center mt-5">

                      <span className="text-green-600 font-bold text-lg">
                        ₹ {item.price}
                      </span>

                     <button
  onClick={() => addToCart(item)}
  disabled={!item.available}
  className={`px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm text-white
    ${
      item.available
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-gray-400 cursor-not-allowed"
    }`}
>
  <Plus size={16} />
  {item.available ? "Add" : "Out of Stock"}
</button>

                    </div>
                  </div>
                ))}

              </div>
            </div>
          ))}

        </div>

       
        <div className="bg-white rounded-2xl shadow-xl p-5 h-fit sticky top-24 border">

          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <ShoppingCart className="text-blue-600" />
            Your Cart
          </h3>

          {cart.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              🛒 Cart is empty
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.itemId}
                className="flex justify-between items-center mb-4 border-b pb-3"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.itemName}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() => decreaseQty(item.itemId)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg"
                  >
                    <Plus size={14} />
                  </button>

                </div>
              </div>
            ))
          )}

       
          <div className="mt-6 border-t pt-4">

            <div className="flex justify-between mb-4">
              <span className="font-semibold text-gray-700">
                Total
              </span>
              <span className="font-bold text-xl text-green-600">
                ₹ {total}
              </span>
            </div>

           <button
  onClick={handleCheckout}
  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-md"
>
  Checkout
</button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default MenuPage;