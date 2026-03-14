import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { api } from "../utils/api";

const ElectricityConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { providerCode, providerName, meterNumber, meterType, amount, phone } =
    location.state || {};

  if (!providerCode || !meterNumber || !amount) {
    return <Navigate to="/electricity" replace />;
  }

  const confirmPurchase = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await api("/api/electricity/buy", {
        method: "POST",
        body: JSON.stringify({
          providerCode,
          meterNumber,
          meterType,
          amount: Number(amount),
          phone,
        }),
      });
      navigate("/electricity-success", {
        state: {
          providerName,
          meterNumber,
          meterType,
          amount,
          phone,
          token: data.token,
          units: data.units,
          reference: data.transaction.reference,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 mr-3 text-xl"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Confirm Electricity Purchase</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="border p-4 rounded-xl mb-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Provider</span>
          <span className="font-semibold">{providerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Meter Type</span>
          <span className="font-semibold capitalize">{meterType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Meter Number</span>
          <span className="font-semibold">{meterNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Phone</span>
          <span className="font-semibold">{phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Amount</span>
          <span className="font-semibold">
            ₦{Number(amount).toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={confirmPurchase}
        disabled={loading}
        className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50 mb-3"
      >
        {loading ? "Processing..." : "Confirm Purchase"}
      </button>

      <button
        onClick={() => navigate(-1)}
        className="w-full bg-gray-200 text-gray-700 p-3 rounded-lg font-semibold"
      >
        Cancel
      </button>
    </div>
  );
};

export default ElectricityConfirm;
