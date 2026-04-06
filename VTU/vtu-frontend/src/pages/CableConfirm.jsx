import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { api } from "../utils/api";

const providerConfig = {
  DSTV: {
    icon: "📡",
    label: "DStv",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  GOTV: {
    icon: "📺",
    label: "GOtv",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    dot: "bg-orange-400",
  },
  STARTIMES: {
    icon: "⭐",
    label: "StarTimes",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
};

const CableConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { provider, smartCardNumber, planId, planName, amount } =
    location.state || {};

  if (!provider || !smartCardNumber || !planId) {
    return <Navigate to="/cable" replace />;
  }

  const prov = providerConfig[provider] || providerConfig.DSTV;

  const confirmPurchase = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await api("/api/cable/buy", {
        method: "POST",
        body: JSON.stringify({ planId, smartCardNumber }),
      });
      navigate("/transaction-success", {
        state: {
          phone: smartCardNumber,
          amount,
          network: provider,
          type: "Cable TV",
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
            Confirm Subscription
          </h1>
          <p className="text-xs text-white/40">Review your cable TV details</p>
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

        {/* Provider badge */}
        <div
          className={`flex items-center gap-3 ${prov.bg} border ${prov.border} rounded-2xl px-4 py-3`}
        >
          <span className="text-xl">{prov.icon}</span>
          <div>
            <p className={`text-sm font-bold ${prov.text}`}>{prov.label}</p>
            <p className="text-white/30 text-xs">Cable TV Subscription</p>
          </div>
          <span className="ml-auto text-white/20 text-xs">Selected</span>
        </div>

        {/* Amount hero card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
          <div
            className="border-b border-white/10 px-5 py-5 text-center"
            style={{
              background:
                "linear-gradient(to right, rgba(108,99,255,0.15), rgba(0,212,170,0.08))",
            }}
          >
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
              Subscription Amount
            </p>
            <p className="font-display text-4xl font-bold text-white">
              ₦{Number(amount).toLocaleString()}
            </p>
            <p className="text-white/40 text-xs mt-1">{planName}</p>
          </div>

          {/* Detail rows */}
          <div className="divide-y divide-white/5">
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Provider</span>
              <span className={`text-sm font-bold ${prov.text}`}>
                {prov.label}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Package</span>
              <span className="text-white text-sm font-semibold">
                {planName}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Smart Card No.</span>
              <span className="text-white text-sm font-semibold tracking-widest">
                {smartCardNumber}
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
            Subscription will be activated on your decoder within minutes. Funds
            will be deducted from your BetaPlug wallet.
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
              "Confirm Subscription →"
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

export default CableConfirm;
