import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Ingredient {
  _id: string;
  name: string;
}

interface Pizza {
  _id: string;
  title: string;
  description: string;
  price: number;
}

interface CartItem {
  pizza: Pizza;
  quantity: number;
}

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const api = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("customer_token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch pizzas
  const loadPizzas = async () => {
    try {
      const res = await axios.get(`${api}/customer/order`, { headers });
      setPizzas(res.data.pizzas || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPizzas();
  }, []);

  // Add to cart (local state)
  const addToCart = (pizza: Pizza) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.pizza._id === pizza._id);

      if (existing) {
        return prev.map((item) =>
          item.pizza._id === pizza._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { pizza, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (pizzaId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.pizza._id === pizzaId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Place Order (final call)
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        pizzaId: item.pizza._id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await axios.post(
        `${api}/customer/order/place`,
        payload,
        { headers }
      );

      alert("Order placed!");
      setCart([]);

    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Customer Dashboard</h1>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <button
          onClick={() => navigate("/customer/create-pizza")}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 transform hover:scale-105"
        >
          Create Custom Pizza
        </button>

        <button
          onClick={() => window.scrollTo(0, document.body.scrollHeight)}
          className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-gray-500/25 transform hover:scale-105"
        >
          🛒 View Cart
        </button>
      </div>

      {/* Pizza List */}
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Available Pizzas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {pizzas.map((p) => (
          <div key={p._id} className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
            <p className="text-gray-600 mb-4">{p.description}</p>
            <p className="text-2xl font-extrabold text-green-600 mb-4">₹{p.price}</p>

            <button
              onClick={() => addToCart(p)}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART SECTION */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.pizza._id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-4 shadow-md"
              >
                <div>
                  <p className="font-bold text-gray-900">{item.pizza.title}</p>
                  <p className="text-sm text-gray-600">
                    ₹{item.pizza.price} × {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => updateQuantity(item.pizza._id, -1)}
                  >
                    -
                  </button>

                  <span className="px-4 py-2 bg-white rounded-xl font-semibold text-gray-900 shadow">{item.quantity}</span>

                  <button
                    className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => updateQuantity(item.pizza._id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-xl mt-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 text-center">
                Total: ₹
                {cart.reduce(
                  (acc, curr) => acc + curr.pizza.price * curr.quantity,
                  0
                )}
              </h3>
            </div>

            <button
              onClick={placeOrder}
              className="mt-6 w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 text-xl"
            >
              Place Order
            </button>
          </>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/customer/orders")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
          >
            📦 My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
