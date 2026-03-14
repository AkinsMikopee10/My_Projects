import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [showFundForm, setShowFundForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api(`/api/admin/users/${id}`);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSuspend = async () => {
    setActionLoading(true);
    setActionMessage("");
    try {
      const isSuspended = user.walletStatus === "suspended";
      await api(
        `/api/admin/users/${id}/${isSuspended ? "unsuspend" : "suspend"}`,
        { method: "PATCH" },
      );
      setUser({
        ...user,
        walletStatus: isSuspended ? "active" : "suspended",
      });
      setActionMessage(
        isSuspended
          ? "User unsuspended successfully"
          : "User suspended successfully",
      );
    } catch (err) {
      setActionMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFundWallet = async () => {
    if (!fundAmount || fundAmount <= 0) return;
    setActionLoading(true);
    setActionMessage("");
    try {
      const data = await api("/api/admin/fund-wallet", {
        method: "POST",
        body: JSON.stringify({ userId: id, amount: Number(fundAmount) }),
      });
      setUser({ ...user, balance: data.balance });
      setFundAmount("");
      setShowFundForm(false);
      setActionMessage("Wallet funded successfully");
    } catch (err) {
      setActionMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center mb-2">
        <button
          onClick={() => navigate("/admin/users")}
          className="text-gray-500 mr-3 text-xl"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">User Detail</h1>
      </div>

      {actionMessage && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded-lg text-sm">
          {actionMessage}
        </div>
      )}

      {/* User Info */}
      <div className="bg-white border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Wallet Balance</span>
          <span className="font-semibold">
            ₦{user.balance.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Wallet Status</span>
          <span
            className={`text-sm font-semibold ${
              user.walletStatus === "active" ? "text-green-600" : "text-red-600"
            }`}
          >
            {user.walletStatus.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Joined</span>
          <span className="font-semibold text-sm">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleSuspend}
          disabled={actionLoading}
          className={`w-full p-3 rounded-lg font-semibold disabled:opacity-50 ${
            user.walletStatus === "suspended"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {actionLoading
            ? "Processing..."
            : user.walletStatus === "suspended"
              ? "Unsuspend User"
              : "Suspend User"}
        </button>

        <button
          onClick={() => setShowFundForm(!showFundForm)}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
        >
          {showFundForm ? "Cancel" : "Fund Wallet"}
        </button>

        {showFundForm && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Enter amount"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleFundWallet}
              disabled={actionLoading}
              className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : "Confirm Fund"}
            </button>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="font-bold text-lg mb-3">Recent Transactions</h2>
        {user.transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {user.transactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-white shadow rounded-xl p-4 flex justify-between"
              >
                <div>
                  <p className="font-semibold capitalize">{tx.type}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{tx.amount.toLocaleString()}</p>
                  <p
                    className={`text-xs font-semibold ${
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
    </div>
  );
};

export default AdminUserDetail;
