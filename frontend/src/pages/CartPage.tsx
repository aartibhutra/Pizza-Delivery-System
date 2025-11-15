import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Pizza {
  _id: string;
  title: string;
  price: number;
}

interface OrderItem {
  pizza: Pizza;
  quantity: number;
}

interface Order {
  _id: string;
  orders: OrderItem[];
  status: string;
  totalprice: number;
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const api = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("customer_token");

  const headers = { Authorization: `Bearer ${token}` };

  // Load cart (Order Recieved)
  const loadCart = async () => {
    try {
      const res = await axios.get(`${api}/customer/order/orders`, { headers });

      const activeCart = res.data.orders?.find(
        (o: Order) => o.status === "Order Recieved"
      );

      setCart(activeCart || null);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Update quantity
  const updateQuantity = async (pizzaId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      await axios.put(
        `${api}/customer/order/update`,
        { pizzaId, quantity },
        { headers }
      );
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item (set quantity = 0)
  const removeItem = async (pizzaId: string) => {
    try {
      await axios.put(
        `${api}/customer/order/update`,
        { pizzaId, quantity: 0 }, // Backend will handle removing
        { headers }
      );
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  // Place order
  const placeOrder = async () => {
    try {
      await axios.post(`${api}/customer/order/place`, {}, { headers });

      alert("Order placed successfully!");

      navigate("/customer/orders");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-700 text-xl">Loading cart...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">

      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Your Cart</h1>

      {!cart || cart.orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">Your cart is empty.</p>
          <button
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 transform hover:scale-105"
            onClick={() => navigate("/customer/dashboard")}
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">

          {/* List items */}
          {cart.orders.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div>
                <p className="font-bold text-gray-900 text-lg">{item.pizza.title}</p>
                <p className="text-sm text-gray-600">
                  ₹{item.pizza.price} × {item.quantity}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() =>
                    updateQuantity(item.pizza._id, item.quantity - 1)
                  }
                >
                  -
                </button>

                <span className="px-4 py-2 bg-gray-100 rounded-xl font-semibold text-gray-900">{item.quantity}</span>

                <button
                  className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() =>
                    updateQuantity(item.pizza._id, item.quantity + 1)
                  }
                >
                  +
                </button>

                <button
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                  onClick={() => removeItem(item.pizza._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Summary</h2>
            <p className="text-3xl font-extrabold text-green-600">Total: ₹{cart.totalprice}</p>
          </div>

          {/* Place Order Button */}
          <button
            onClick={placeOrder}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 text-xl"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
