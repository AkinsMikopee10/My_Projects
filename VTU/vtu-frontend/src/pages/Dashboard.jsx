import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch user");
        }
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>
      <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg">
        <p className="text-sm opacity-80">Wallet Balance</p>
        <p className="text-3xl font-bold mt-2">
          ₦ {user.balance.toLocaleString()}
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded-xl">
        <p className="text-sm text-gray-500">Email</p>
        <p className="font-semibold">{user.email}</p>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
