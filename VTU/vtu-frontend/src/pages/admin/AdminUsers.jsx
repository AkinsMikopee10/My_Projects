import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api("/api/admin/users");
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="text-gray-500 mr-3 text-xl"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">All Users</h1>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <p className="text-sm text-gray-500 mb-3">
        {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
      </p>

      {/* User List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
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
                <p className="text-xs text-gray-400">
                  ₦{user.balance.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  user.walletStatus === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.walletStatus}
              </span>
              <p className="text-gray-400 text-sm mt-1">→</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
