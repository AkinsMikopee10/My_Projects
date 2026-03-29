import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const services = [
  {
    label: "Airtime",
    path: "/airtime",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    gradient: "from-violet-500 to-brand-primary",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-300",
  },
  {
    label: "Data",
    path: "/data",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M1.36 6.26A20 20 0 0 1 22.64 6.26" />
        <path d="M5 10.3A13 13 0 0 1 19 10.3" />
        <path d="M9.1 14.33A6.5 6.5 0 0 1 14.9 14.33" />
        <circle cx="12" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
    gradient: "from-brand-accent to-teal-400",
    bg: "bg-brand-accent/10",
    border: "border-brand-accent/20",
    text: "text-brand-accent",
  },
  {
    label: "Cable TV",
    path: "/cable",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 3 8 7" />
        <path d="M8 3l8 4" />
      </svg>
    ),
    gradient: "from-pink-500 to-rose-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-300",
  },
  {
    label: "Electricity",
    path: "/electricity",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M9 2L4 13h7l-2 9 11-12h-7l2-8z" />
      </svg>
    ),
    gradient: "from-amber-400 to-orange-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    text: "text-amber-300",
  },
  {
    label: "History",
    path: "/transactions",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M12 8v4l3 3" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    gradient: "from-sky-500 to-blue-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    text: "text-sky-300",
  },
  {
    label: "Profile",
    path: "/profile",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    gradient: "from-slate-400 to-slate-500",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    text: "text-slate-300",
  },
];

const txTypeLabel = (type) => {
  const map = {
    airtime: "Airtime",
    data: "Data",
    cable: "Cable TV",
    electricity: "Electricity",
    funding: "Wallet Funding",
  };
  return map[type] || type;
};

const txStatusStyle = (status) => {
  if (status === "successful")
    return "bg-brand-accent/10 text-brand-accent border border-brand-accent/20";
  if (status === "pending")
    return "bg-amber-400/10 text-amber-300 border border-amber-400/20";
  return "bg-red-500/10 text-red-300 border border-red-500/20";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center animate-pulse">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 2L4 13h7l-2 9 11-12h-7l2-8z" fill="white" />
            </svg>
          </div>
          <p className="text-white/40 text-sm font-sans">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-2 rounded-xl font-semibold text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-brand-dark font-sans pb-10">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-primary -top-32 -right-20 blur-[80px] opacity-25" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-brand-accent -bottom-20 -left-16 blur-[80px] opacity-20" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 2L4 13h7l-2 9 11-12h-7l2-8z" fill="white" />
                </svg>
              </div>
              <span className="font-display text-lg font-extrabold text-white tracking-tight">
                Beta
                <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                  Plug
                </span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-red-400 transition-colors font-medium"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>

          {/* Greeting */}
          <div>
            <p className="text-white/40 text-sm">Good day,</p>
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">
              {firstName} 👋
            </h1>
          </div>

          {/* Wallet card */}
          <div className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-brand-primary via-[#5a54e0] to-brand-accent">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-3 right-6 w-32 h-32 rounded-full border-[20px] border-white" />
              <div className="absolute -bottom-6 -right-4 w-48 h-48 rounded-full border-[20px] border-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/70 text-sm font-medium">
                  Wallet Balance
                </p>
                <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-[11px] text-white font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                  Active
                </div>
              </div>
              <p className="text-4xl font-extrabold text-white font-display tracking-tight mb-1">
                ₦{balance.toLocaleString()}
              </p>
              <p className="text-white/50 text-xs">{user?.email}</p>
            </div>
          </div>

          {/* Fund wallet button */}
          <button
            onClick={() => navigate("/fund-wallet")}
            className="w-full bg-white/[0.06] hover:bg-white/10 border border-white/10 hover:border-brand-accent/40 text-white font-semibold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Fund Wallet
          </button>

          {/* Services grid */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
              Services
            </p>
            <div className="grid grid-cols-3 gap-3">
              {services.map((svc) => (
                <button
                  key={svc.label}
                  onClick={() => navigate(svc.path)}
                  className={`${svc.bg} border ${svc.border} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all`}
                >
                  <div className={`${svc.text}`}>{svc.icon}</div>
                  <p className={`text-xs font-semibold ${svc.text}`}>
                    {svc.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">
                Recent Transactions
              </p>
              <button
                onClick={() => navigate("/transactions")}
                className="text-[12px] text-brand-primary font-semibold hover:underline"
              >
                See all
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center">
                <p className="text-white/25 text-sm">No transactions yet</p>
                <p className="text-white/15 text-xs mt-1">
                  Your transactions will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx._id}
                    className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 py-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                        <span className="text-base">
                          {tx.type === "airtime"
                            ? "📞"
                            : tx.type === "data"
                              ? "📶"
                              : tx.type === "cable"
                                ? "📺"
                                : tx.type === "electricity"
                                  ? "⚡"
                                  : "💰"}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">
                          {txTypeLabel(tx.type)}
                        </p>
                        <p className="text-white/35 text-xs">
                          {new Date(tx.createdAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-sm mb-1">
                        ₦{tx.amount.toLocaleString()}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${txStatusStyle(tx.status)}`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
