import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { api } from "../utils/api";

const ElectricityConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { providerCode, providerName, meterNumber, meterType, amount, phone } =
    location.state || {};

  if (!providerCode || !meterNumber || !amount) {
    return <Navigate to="/electricity" replace />;
  }

  const confirmPurchase = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await api("/api/electricity/buy", {
        method: "POST",
        body: JSON.stringify({
          providerCode,
          meterNumber,
          meterType,
          amount: Number(amount),
          phone,
        }),
      });
      navigate("/electricity-success", {
        state: {
          providerName,
          meterNumber,
          meterType,
          amount,
          phone,
          token: data.token,
          units: data.units,
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
      <div className="absolute top-[-80px] right-[-60px] w-72 h-72 rounded-full bg-yellow-400 opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full bg-brand-primary opacity-10 blur-3xl pointer-events-none" />

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
            Review your electricity details
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

        {/* Provider + meter type badge row */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl px-4 py-3 flex-1">
            <span className="text-yellow-400 text-base">⚡</span>
            <span className="text-yellow-400 text-sm font-bold truncate">
              {providerName}
            </span>
          </div>
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 border
            ${
              meterType === "prepaid"
                ? "bg-brand-accent/10 border-brand-accent/20"
                : "bg-brand-primary/10 border-brand-primary/20"
            }`}
          >
            <span className="text-base">
              {meterType === "prepaid" ? "⚡" : "📋"}
            </span>
            <span
              className={`text-sm font-bold capitalize
              ${meterType === "prepaid" ? "text-brand-accent" : "text-brand-primary"}`}
            >
              {meterType}
            </span>
          </div>
        </div>

        {/* Amount hero card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
          <div
            className="border-b border-white/10 px-5 py-5 text-center"
            style={{
              background:
                "linear-gradient(to right, rgba(234,179,8,0.08), rgba(108,99,255,0.12))",
            }}
          >
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
              Amount to Pay
            </p>
            <p className="font-display text-4xl font-bold text-white">
              ₦{Number(amount).toLocaleString()}
            </p>
            <p className="text-white/40 text-xs mt-1">Electricity Token</p>
          </div>

          {/* Detail rows */}
          <div className="divide-y divide-white/5">
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Provider</span>
              <span className="text-yellow-400 text-sm font-bold">
                {providerName}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Meter Type</span>
              <span className="text-white text-sm font-semibold capitalize">
                {meterType}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-white/50 text-sm">Meter Number</span>
              <span className="text-white text-sm font-semibold tracking-widest">
                {meterNumber}
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
        <div className="flex items-start gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl px-4 py-3">
          <span className="text-yellow-400 text-base leading-none mt-0.5">
            ⚡
          </span>
          <p className="text-white/50 text-xs leading-relaxed">
            Your token will be generated instantly after payment. Keep it safe —
            you'll need it to recharge your meter.
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

export default ElectricityConfirm;
