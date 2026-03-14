import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const StatCard = ({ label, value, icon, color }) => (
  <div className={`${color} p-4 rounded-xl text-white`}>
    <div className="text-3xl mb-1">{icon}</div>
    <p className="text-sm opacity-80">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api("/api/admin/stats");
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="bg-blue-600"
        />
        <StatCard
          label="Total Transactions"
          value={stats.totalTransactions}
          icon="💳"
          color="bg-purple-600"
        />
        <StatCard
          label="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="bg-green-600"
        />
        <StatCard
          label="Recent Users"
          value={stats.recentUsers.length}
          icon="🆕"
          color="bg-orange-500"
        />
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "👥 Users", path: "/admin/users" },
          { label: "💳 Transactions", path: "/admin/transactions" },
          { label: "📶 Data Plans", path: "/admin/data-plans" },
          { label: "📺 Cable Plans", path: "/admin/cable-plans" },
          { label: "💡 Electricity", path: "/admin/electricity-providers" },
          { label: "💰 Fund Wallet", path: "/admin/fund-wallet" },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="bg-white border p-4 rounded-xl font-semibold text-left shadow-sm"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="font-bold text-lg mb-3">Recent Transactions</h2>
        <div className="space-y-3">
          {stats.recentTransactions.map((tx) => (
            <div
              key={tx._id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold capitalize">{tx.type}</p>
                <p className="text-xs text-gray-500">
                  {tx.user?.name || "Unknown"}
                </p>
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
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="font-bold text-lg mb-3">Recent Users</h2>
        <div className="space-y-3">
          {stats.recentUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/admin/users/${user._id}`)}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
