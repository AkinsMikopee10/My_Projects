import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const Cable = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState("DSTV");
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [planId, setPlanId] = useState("");
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const data = await api("/api/cable/plans");
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch cable plans:", err.message);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter((p) => p.provider === provider);
  const selectedPlan = plans.find((p) => p._id === planId);

  const handleContinue = () => {
    setError("");
    if (!smartCardNumber || !planId) {
      setError("Please fill in all fields");
      return;
    }
    if (smartCardNumber.length < 10) {
      setError("Enter a valid smart card number");
      return;
    }
    navigate("/cable-confirm", {
      state: {
        provider,
        smartCardNumber,
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
        <h1 className="text-xl font-bold">Cable TV Subscription</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Provider Selection */}
        <select
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value);
            setPlanId("");
          }}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="DSTV">DSTV</option>
          <option value="GOTV">GOTV</option>
          <option value="STARTIMES">STARTIMES</option>
        </select>

        {/* Smart Card Number */}
        <input
          type="text"
          placeholder="Smart Card / IUC Number"
          value={smartCardNumber}
          onChange={(e) => setSmartCardNumber(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Plan Selection */}
        <select
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {loadingPlans ? "Loading plans..." : "Select Plan"}
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
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Cable;
