import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

const FundWallet = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFund = async () => {
        setError("");
        if (!amount || Number(amount) < 100) {
            setError("Minimum amount is ₦100");
            return;
        }
        setLoading(true);
        try {
            const data = await api("/api/wallet/initialize-payment", {
                method: "POST",
                body: JSON.stringify({ amount: Number(amount) }),
            });

            // Redirect to Paystack payment page
            window.location.href = data.authorization_url;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
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
            <h1 className="text-xl font-bold">Fund Wallet</h1>
          </div>
    
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
    
          {/* Preset Amounts */}
          <p className="text-sm text-gray-500 mb-3">Select or enter amount</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(String(preset))}
                className={`p-3 rounded-xl border font-semibold text-sm ${
                  amount === String(preset)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                ₦{preset.toLocaleString()}
              </button>
            ))}
          </div>
    
          {/* Custom Amount */}
          <input
            type="number"
            placeholder="Or enter custom amount (min ₦100)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
    
          {/* Summary */}
          {amount && Number(amount) >= 100 && (
            <div className="bg-gray-50 border rounded-xl p-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold">
                  ₦{Number(amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-semibold">Card (Paystack)</span>
              </div>
            </div>
          )}
    
          <button
            onClick={handleFund}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Redirecting to Paystack..." : "Pay with Paystack"}
          </button>
    
          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 Secured by Paystack. Your card details are safe.
          </p>
        </div>
      );
    };
    
    export default FundWallet;