import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const typeColors = {
  funding: "bg-green-100 text-green-700",
  airtime: "bg-blue-100 text-blue-700",
  data: "bg-purple-100 text-purple-700",
  cable: "bg-yellow-100 text-yellow-700",
  electricity: "bg-orange-100 text-orange-700",
};

const typeIcons = {
  funding: "💰",
  airtime: "📞",
  data: "📶",
  cable: "📺",
  electricity: "💡",
};

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await api("/api/transactions");
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
        <h1 className="text-xl font-bold">Transaction History</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {["all", "funding", "airtime", "data", "cable", "electricity"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-10">
          No transactions found
        </p>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx._id}
              onClick={() => navigate(`/receipt/${tx._id}`)}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center cursor-pointer active:opacity-70"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`text-xl w-10 h-10 flex items-center justify-center rounded-full ${
                    typeColors[tx.type] || "bg-gray-100"
                  }`}
                >
                  {typeIcons[tx.type] || "💳"}
                </div>
                <div>
                  <p className="font-semibold capitalize">{tx.type}</p>
                  <p className="text-xs text-gray-500">
                    {tx.metadata?.phone ||
                      tx.metadata?.meterNumber ||
                      tx.metadata?.smartCardNumber ||
                      "-"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
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
                <p className="text-xs text-gray-400 mt-1">View →</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;
