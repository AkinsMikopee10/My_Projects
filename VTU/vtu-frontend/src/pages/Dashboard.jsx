import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fundError, setFundError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleFund = async () => {
    setFundError("");
    if (!amount || amount <= 0) {
      setFundError("Enter a valid amount");
      return;
    }
    try {
      const data = await api("/api/wallet/fund", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      });
      setBalance(data.balance);
      setAmount("");
    } catch (err) {
      setFundError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meData, txData] = await Promise.all([
          api("/api/auth/me"),
          api("/api/transactions"),
        ]);
        setBalance(meData.balance);
        setTransactions(Array.isArray(txData) ? txData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-600 text-white p-3 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Welcome, {user?.name} 👋</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Wallet Balance */}
      <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg">
        <p className="text-sm opacity-80">Wallet Balance</p>
        <p className="text-3xl font-bold mt-2">₦{balance.toLocaleString()}</p>
      </div>

      {/* Fund Wallet */}
      <div className="bg-white border p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-3">Fund Wallet</h2>
        {fundError && (
          <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm mb-2">
            {fundError}
          </div>
        )}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleFund}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold"
        >
          Fund Wallet
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/airtime")}
          className="bg-blue-100 p-4 rounded-xl text-center"
        >
          📞<p className="text-sm mt-1">Airtime</p>
        </button>
        <button
          onClick={() => navigate("/data")}
          className="bg-blue-100 p-4 rounded-xl text-center"
        >
          📶<p className="text-sm mt-1">Data</p>
        </button>
        <button className="bg-blue-100 p-4 rounded-xl text-center opacity-50">
          📺<p className="text-sm mt-1">Cable</p>
        </button>
        <button className="bg-blue-100 p-4 rounded-xl text-center opacity-50">
          💡<p className="text-sm mt-1">Electricity</p>
        </button>
        <button
          onClick={() => navigate("/transactions")}
          className="bg-blue-100 p-4 rounded-xl text-center"
        >
          📜<p className="text-sm mt-1">History</p>
        </button>
        <button className="bg-blue-100 p-4 rounded-xl text-center opacity-50">
          👤<p className="text-sm mt-1">Profile</p>
        </button>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx._id}
                className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium capitalize">{tx.type}</p>
                  <p className="text-xs text-gray-500">
                    {tx.metadata?.phone || "-"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{tx.amount.toLocaleString()}</p>
                  <p
                    className={`text-xs ${
                      tx.status === "successful"
                        ? "text-green-500"
                        : tx.status === "pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded-xl">
        <p className="text-sm text-gray-500">Email</p>
        <p className="font-semibold">{user?.email}</p>
      </div>
    </div>
  );
};

export default Dashboard;
