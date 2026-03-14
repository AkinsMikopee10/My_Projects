import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const Data = () => {
  const navigate = useNavigate();
  const [network, setNetwork] = useState("MTN");
  const [phone, setPhone] = useState("");
  const [planId, setPlanId] = useState("");
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const data = await api("/api/data/plans");
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch plans:", err.message);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter((p) => p.network === network);

  const selectedPlan = plans.find((p) => p._id === planId);

  const handleBuyData = () => {
    setError("");
    if (!phone || !planId) {
      setError("Please fill in all fields");
      return;
    }
    if (phone.length !== 11) {
      setError("Enter a valid 11-digit phone number");
      return;
    }
    navigate("/data-confirm", {
      state: {
        network,
        phone,
        planId,
        planName: selectedPlan?.planName,
        amount: selectedPlan?.price,
      },
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-500 mr-3 text-xl"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Buy Data</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <select
          value={network}
          onChange={(e) => {
            setNetwork(e.target.value);
            setPlanId("");
          }}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="MTN">MTN</option>
          <option value="GLO">GLO</option>
          <option value="AIRTEL">AIRTEL</option>
          <option value="9MOBILE">9MOBILE</option>
        </select>

        <input
          type="text"
          placeholder="Phone Number (e.g 08012345678)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {loadingPlans ? "Loading plans..." : "Select Data Plan"}
          </option>
          {filteredPlans.map((p) => (
            <option key={p._id} value={p._id}>
              {p.planName} — ₦{p.price.toLocaleString()}
            </option>
          ))}
          {!loadingPlans && filteredPlans.length === 0 && (
            <option disabled>No plans available</option>
          )}
        </select>

        <button
          onClick={handleBuyData}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Data;
