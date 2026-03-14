import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const AdminFundWallet = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFund = async () => {
    setError("");
    setSuccess("");
    if (!userId || !amount || amount <= 0) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const data = await api("/api/admin/fund-wallet", {
        method: "POST",
        body: JSON.stringify({ userId, amount: Number(amount) }),
      });
      setSuccess(
        `Wallet funded successfully. New balance: ₦${data.balance.toLocaleString()}`,
      );
      setUserId("");
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="text-gray-500 mr-3 text-xl"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Fund User Wallet</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">User ID</label>
          <input
            type="text"
            placeholder="Paste user MongoDB ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Tip: Copy the user ID from the Users page
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Amount (₦)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleFund}
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Fund Wallet"}
        </button>
      </div>
    </div>
  );
};

export default AdminFundWallet;
