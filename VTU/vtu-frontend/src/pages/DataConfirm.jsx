import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { api } from "../utils/api";

const networkConfig = {
  MTN: {
    color: "from-yellow-400 to-yellow-500",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  GLO: {
    color: "from-green-400 to-green-500",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    text: "text-green-400",
    dot: "bg-green-400",
  },
  AIRTEL: {
    color: "from-red-400 to-red-500",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    text: "text-red-400",
    dot: "bg-red-400",
  },
  "9MOBILE": {
    color: "from-emerald-400 to-teal-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
};

const DataConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { phone, amount, network, planId, planName } = location.state || {};

  if (!phone || !amount || !network || !planId) {
    return <Navigate to="/data" replace />;
  }

  const net = networkConfig[network] || networkConfig.MTN;

  const confirmPurchase = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await api("/api/data/buy", {
        method: "POST",
        body: JSON.stringify({ phone, planId }),
      });
      navigate("/transaction-success", {
        state: {
          phone,
          amount,
          network,
          type: "Data",
          planName,
          reference: data.transaction.reference,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-brand-primary opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-brand-accent opacity-10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          ←
        </button>
        <div>
          <h1 className="font-display text-lg font-bold text-white leading-tight">
            Confirm Purchase
          </h1>
          <p className="text-xs text-white/40">
            Review your data bundle details
          </p>
        </div>
      </div>

      <div className="relative z-10 px-5 space-y-4 animate-slideUp pb-10">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Network + plan badge row */}
        <div className="flex gap-2">
          <div
            className={`flex items-center gap-2 ${net.bg} border ${net.border} rounded-2xl px-4 py-3 flex-1`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${net.dot}`} />
            <span className={`text-sm font-bold ${net.text}`}>{network}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 flex-1">
            <span className="text-white/30 text-sm">🌐</span>
            <span className="text-white/70 text-sm font-semibold truncate">
              {planName}
            </span>
          </div>
        </div>

        {/* Amount hero card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
          <div
            className={`bg-gradient-to-r ${net.color} bg-opacity-10 from-[${net.color}]/10 border-b border-white/10 px-5 py-5 text-center`}
            style={{
              background:
                "linear-gradient(to right, rgba(108,99,255,0.15), rgba(0,212,170,0.08))",
            }}
          >
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
              Total Amount
            </p>
            <p className="font-display text-4xl font-bold text-white">
              ₦{Number(amount).toLocaleString()}
            </p>
            <p className="text-white/40 text-xs mt-1">Data Bundle</p>
          </div>

          {/* Detail rows */}
          <div className="divide-y divide-white/5">
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Network</span>
              <span className={`text-sm font-bold ${net.text}`}>{network}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Bundle</span>
              <span className="text-white text-sm font-semibold">
                {planName}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Phone Number</span>
              <span className="text-white text-sm font-semibold tracking-wide">
                {phone}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Transaction Fee</span>
              <span className="text-brand-accent text-sm font-semibold">
                Free
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-4 bg-white/[0.02]">
              <span className="text-white/80 text-sm font-semibold">
                Total Deducted
              </span>
              <span className="text-white text-sm font-bold">
                ₦{Number(amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl px-4 py-3">
          <span className="text-brand-primary text-base leading-none mt-0.5">
            ℹ
          </span>
          <p className="text-white/50 text-xs leading-relaxed">
            Data will be activated instantly on the selected number. Funds will
            be deducted from your BetaPlug wallet.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <button
            onClick={confirmPurchase}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-display font-bold text-white text-base
              bg-gradient-to-r from-brand-primary to-brand-accent
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:opacity-90 active:scale-[0.98] transition-all
              shadow-lg shadow-brand-primary/25"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-5 h-5"
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
                Processing...
              </span>
            ) : (
              "Confirm Purchase →"
            )}
          </button>

          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-semibold text-white/60 text-sm
              bg-white/[0.04] border border-white/10
              hover:bg-white/[0.07] hover:text-white/80
              disabled:opacity-40 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataConfirm;
