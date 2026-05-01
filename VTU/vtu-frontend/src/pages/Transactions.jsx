import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const typeConfig = {
  funding: {
    icon: "💰",
    label: "Funding",
    bg: "bg-green-400/10",
    text: "text-green-400",
    dot: "bg-green-400",
  },
  airtime: {
    icon: "📞",
    label: "Airtime",
    bg: "bg-blue-400/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  data: {
    icon: "📶",
    label: "Data",
    bg: "bg-brand-primary/10",
    text: "text-brand-primary",
    dot: "bg-brand-primary",
  },
  cable: {
    icon: "📺",
    label: "Cable TV",
    bg: "bg-orange-400/10",
    text: "text-orange-400",
    dot: "bg-orange-400",
  },
  electricity: {
    icon: "⚡",
    label: "Electricity",
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
};

const statusConfig = {
  successful: {
    text: "text-brand-accent",
    dot: "bg-brand-accent",
    label: "Successful",
  },
  pending: { text: "text-yellow-400", dot: "bg-yellow-400", label: "Pending" },
  failed: { text: "text-red-400", dot: "bg-red-400", label: "Failed" },
};

const filters = ["all", "funding", "airtime", "data", "cable", "electricity"];

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

  return (
    <div className="min-h-screen bg-brand-dark font-sans relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-80px] right-[-60px] w-72 h-72 rounded-full bg-brand-primary opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full bg-brand-accent opacity-10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-12 pb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          ←
        </button>
        <div>
          <h1 className="font-display text-lg font-bold text-white leading-tight">
            Transactions
          </h1>
          <p className="text-xs text-white/40">Your full purchase history</p>
        </div>
      </div>

      <div className="relative z-10 px-5 animate-slideUp">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
          {filters.map((type) => {
            const cfg = typeConfig[type];
            const isActive = filter === type;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all
                  ${
                    isActive
                      ? type === "all"
                        ? "bg-brand-primary/20 border-brand-primary/40 text-brand-primary"
                        : `${cfg.bg} border-transparent ${cfg.text}`
                      : "bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/[0.06]"
                  }`}
              >
                {cfg && <span>{cfg.icon}</span>}
                {type === "all" ? "All" : cfg.label}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg
              className="animate-spin w-6 h-6 text-brand-primary mr-3"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-white/40 text-sm">
              Loading transactions...
            </span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4">
            <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl mb-4">
              🧾
            </div>
            <p className="text-white/40 text-sm font-semibold">
              No transactions found
            </p>
            <p className="text-white/20 text-xs mt-1">
              {filter === "all"
                ? "Your history will appear here"
                : `No ${filter} transactions yet`}
            </p>
          </div>
        )}

        {/* Transaction list */}
        {!loading && !error && filteredTransactions.length > 0 && (
          <div className="space-y-2 pb-10">
            {filteredTransactions.map((tx) => {
              const type = typeConfig[tx.type] || {
                icon: "💳",
                label: tx.type,
                bg: "bg-white/10",
                text: "text-white/60",
                dot: "bg-white/40",
              };
              const status = statusConfig[tx.status] || statusConfig.failed;
              const subtitle =
                tx.metadata?.phone ||
                tx.metadata?.meterNumber ||
                tx.metadata?.smartCardNumber ||
                "—";

              return (
                <div
                  key={tx._id}
                  onClick={() => navigate(`/receipt/${tx._id}`)}
                  className="flex items-center gap-4 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4
                    hover:bg-white/[0.07] active:scale-[0.98] cursor-pointer transition-all"
                >
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl ${type.bg} flex items-center justify-center text-xl flex-shrink-0`}
                  >
                    {type.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm font-bold ${type.text}`}>
                        {type.label}
                      </p>
                      <span
                        className={`flex items-center gap-1 text-xs font-semibold ${status.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs truncate">{subtitle}</p>
                    <p className="text-white/25 text-xs mt-0.5">
                      {new Date(tx.createdAt).toLocaleString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Amount + arrow */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-display font-bold text-base">
                      ₦{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-white/20 text-xs mt-1">View →</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
