import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalOrders = orders.length;
  const ongoingOrders = orders.filter((o : any) => o.status !== "Delivered");
  const pendingDeliveries = ongoingOrders.length;

  const totalPizzas = orders.reduce((sum, order : any) => {
    return sum + order.orders.reduce((sub : any, item : any) => sub + item.quantity, 0);
  }, 0);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    navigate("/admin/login");
  };

  const fetchOrders = async (token: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/order`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const name = localStorage.getItem("admin_name");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setAdminName(name || "Admin");

    fetchOrders(token);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="w-64 bg-white/80 backdrop-blur-sm shadow-xl p-5 flex flex-col rounded-r-3xl">
        <h2 className="text-xl font-bold mb-8 text-gray-900">Admin Panel</h2>

        <div className="space-y-4">
          <button onClick={() => navigate("/admin/dashboard")} className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">Dashboard Home</button>
          <button onClick={() => navigate("/admin/manage/bases")} className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">Manage Bases</button>
          <button onClick={() => navigate("/admin/manage/sauces")} className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">Manage Sauces</button>
          <button onClick={() => navigate("/admin/manage/cheese")} className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">Manage Cheese</button>
          <button onClick={() => navigate("/admin/manage/veggies")} className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">Manage Veggies</button>
          <button onClick={() => navigate("/admin/manage/pizzas")} className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">Manage Pizza Variants</button>
          <button onClick={() => navigate("/admin/orders")} className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">Orders</button>
        </div>

        <div className="mt-auto pt-5">
          <button onClick={handleLogout} className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome, {adminName}</h1>
        </div>

        {loading ? (
          <div className="text-center mt-20 text-gray-700 text-xl">Loading orders...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Total Orders</h3>
                <p className="text-4xl font-extrabold text-pink-600">{totalOrders}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Total Pizzas Sold</h3>
                <p className="text-4xl font-extrabold text-purple-600">{totalPizzas}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Pending Deliveries</h3>
                <p className="text-4xl font-extrabold text-blue-600">{pendingDeliveries}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl mt-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Ongoing Orders</h2>

              {ongoingOrders.length === 0 ? (
                <p className="text-gray-600 text-lg">No ongoing orders right now.</p>
              ) : (
                <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-pink-100 to-purple-100">
                      <th className="p-4 font-bold text-gray-900">Order ID</th>
                      <th className="p-4 font-bold text-gray-900">Customer</th>
                      <th className="p-4 font-bold text-gray-900">Status</th>
                      <th className="p-4 font-bold text-gray-900">Total Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ongoingOrders.map((ord: { _id: string; userId?: { name: string }; status: string; totalprice: number }) => (
                      <tr key={ord._id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-colors">
                        <td className="p-4">{ord._id}</td>
                        <td className="p-4">{ord.userId?.name}</td>
                        <td className="p-4 font-semibold text-purple-600">{ord.status}</td>
                        <td className="p-4 font-bold text-green-600">₹{ord.totalprice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
