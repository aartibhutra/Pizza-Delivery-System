import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Ingredient {
  _id: string;
  name: string;
  price: number;
}

export default function CreatePizza() {
  const navigate = useNavigate();

  const [bases, setBases] = useState<Ingredient[]>([]);
  const [sauces, setSauces] = useState<Ingredient[]>([]);
  const [cheeses, setCheeses] = useState<Ingredient[]>([]);
  const [veggies, setVeggies] = useState<Ingredient[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [baseId, setBaseId] = useState("");
  const [sauceId, setSauceId] = useState("");
  const [cheeseId, setCheeseId] = useState("");
  const [veggieIds, setVeggieIds] = useState<string[]>([]);

  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const api = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("customer_token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch all pizzas so ingredients can be extracted
  const loadIngredients = async () => {
    try {
      const res = await axios.get(`${api}/customer/order`, { headers });

      const pizzas = res.data.pizzas || [];

      setBases(extractUnique(pizzas.map((p: any) => p.base)));
      setSauces(extractUnique(pizzas.map((p: any) => p.sauce)));
      setCheeses(extractUnique(pizzas.map((p: any) => p.cheese)));

      const vegList = pizzas.flatMap((p: any) => p.veggies || []);
      setVeggies(extractUnique(vegList));
    } catch (err) {
      console.error(err);
    }
  };

  // Utility - remove duplicates + null
  const extractUnique = (items: any[]) => {
    const map = new Map();
    items.forEach((item) => {
      if (item && item._id) map.set(item._id, item);
    });
    return Array.from(map.values());
  };

  // Calculate total pizza price
  const calcPrice = () => {
    let total = 0;

    if (baseId) total += bases.find((b) => b._id === baseId)?.price || 0;
    if (sauceId) total += sauces.find((s) => s._id === sauceId)?.price || 0;
    if (cheeseId) total += cheeses.find((c) => c._id === cheeseId)?.price || 0;

    veggieIds.forEach((vid) => {
      total += veggies.find((v) => v._id === vid)?.price || 0;
    });

    setPrice(total);
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  useEffect(() => {
    calcPrice();
  }, [baseId, sauceId, cheeseId, veggieIds]);

  // Submit custom pizza
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${api}/customer/order/pizza`,
        {
          title,
          description,
          base: baseId || null,
          sauce: sauceId || null,
          cheese: cheeseId || null,
          veggies: veggieIds,
          price,
        },
        { headers }
      );

      alert("Custom pizza created!");
      navigate("/customer/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create pizza.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">

        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Create Custom Pizza</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block mb-2 font-bold text-gray-900">Pizza Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all duration-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-bold text-gray-900">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 resize-none"
            />
          </div>

          {/* Base */}
          <div>
            <label className="block mb-2 font-bold text-gray-900">Choose Base</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all duration-300 bg-white"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
            >
              <option value="">None</option>
              {bases.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} (+₹{b.price})
                </option>
              ))}
            </select>
          </div>

          {/* Sauce */}
          <div>
            <label className="block mb-2 font-bold text-gray-900">Choose Sauce</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 bg-white"
              value={sauceId}
              onChange={(e) => setSauceId(e.target.value)}
            >
              <option value="">None</option>
              {sauces.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} (+₹{s.price})
                </option>
              ))}
            </select>
          </div>

          {/* Cheese */}
          <div>
            <label className="block mb-2 font-bold text-gray-900">Choose Cheese</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all duration-300 bg-white"
              value={cheeseId}
              onChange={(e) => setCheeseId(e.target.value)}
            >
              <option value="">None</option>
              {cheeses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} (+₹{c.price})
                </option>
              ))}
            </select>
          </div>

          {/* Veggies */}
          <div>
            <label className="block mb-2 font-bold text-gray-900">Choose Veggies</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 bg-white"
              multiple
              value={veggieIds}
              onChange={(e) =>
                setVeggieIds(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
            >
              <option value="">None</option>
              {veggies.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name} (+₹{v.price})
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md text-center">
            <p className="text-xl font-bold text-gray-900">Total Price: ₹{price}</p>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "Creating..." : "Create Pizza"}
          </button>

        </form>
      </div>
    </div>
  );
}
