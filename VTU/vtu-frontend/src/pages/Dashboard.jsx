import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleFund = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/wallet/fund", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setUser({ ...user, balance: data.balance });
      setAmount("");
    } catch (error) {
      alert(error.message);
    }
  };

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
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/wallet/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Fetch transactions error:", error);
      }
    };

    fetchTransactions();
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

      <div className="bg-white border p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-3">Fund Wallet</h2>

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

        <button
          onClick={() => navigate("/airtime")}
          className={
            "w-full bg-orange-500 text-white p-3 rounded-lg font-semibold mt-4"
          }
        >
          Buy Airtime
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Transaction History</h3>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium capitalize">{tx.type}</p>
                    <p className="text-xs text-gray-500">₦ {tx.reference}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₦{tx.amount}</p>
                    <p
                      className={`text-xs ${
                        tx.status === "successful"
                          ? "text-green-500"
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
