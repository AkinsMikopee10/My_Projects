import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

const FundWallet = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFund = async () => {
    setError("");
    if (!amount || Number(amount) < 100) {
      setError("Minimum amount is ₦100");
      return;
    }
    setLoading(true);
    try {
      const data = await api("/api/wallet/initialize-payment", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      });
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const isValidAmount = amount && Number(amount) >= 100;

  return (
    <div className="min-h-screen bg-brand-dark font-sans relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-brand-accent opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-brand-primary opacity-10 blur-3xl pointer-events-none" />

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
            Fund Wallet
          </h1>
          <p className="text-xs text-white/40">
            Add money to your BetaPlug wallet
          </p>
        </div>
      </div>

      <div className="relative z-10 px-5 space-y-5 pb-10 animate-slideUp">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Amount input */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Enter Amount
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-white/40 text-lg">
              ₦
            </span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-9 pr-4 py-5
                text-white placeholder-white/20 font-display font-bold text-2xl
                focus:outline-none focus:border-brand-accent/50 focus:bg-white/[0.06] transition-all"
            />
          </div>
          <p className="text-white/20 text-xs mt-2 pl-1">
            Minimum deposit: ₦100
          </p>
        </div>

        {/* Preset amounts */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Quick Select
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((preset) => {
              const isActive = amount === String(preset);
              return (
                <button
                  key={preset}
                  onClick={() => setAmount(String(preset))}
                  className={`py-3 rounded-2xl border text-sm font-bold transition-all
                    ${
                      isActive
                        ? "bg-brand-accent/15 border-brand-accent/40 text-brand-accent scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white/70"
                    }`}
                >
                  ₦{preset.toLocaleString()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary card — appears when valid amount entered */}
        {isValidAmount && (
          <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-2xl px-5 py-4 space-y-3">
            <p className="text-white/40 text-xs uppercase tracking-widest">
              Payment Summary
            </p>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Amount</span>
              <span className="font-display text-xl font-bold text-white">
                ₦{Number(amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Payment Method</span>
              <span className="text-white text-sm font-semibold">Paystack</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Processing Fee</span>
              <span className="text-brand-accent text-sm font-semibold">
                Free
              </span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white/80 text-sm font-semibold">
                You'll receive
              </span>
              <span className="font-display text-xl font-bold text-brand-accent">
                ₦{Number(amount).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Paystack CTA */}
        <button
          onClick={handleFund}
          disabled={loading || !isValidAmount}
          className="w-full py-4 rounded-2xl font-display font-bold text-white text-base
            bg-gradient-to-r from-brand-primary to-brand-accent
            disabled:opacity-40 disabled:cursor-not-allowed
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
              Redirecting to Paystack...
            </span>
          ) : (
            `Pay ₦${isValidAmount ? Number(amount).toLocaleString() : "0"} with Paystack →`
          )}
        </button>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-white/20">
            <span className="text-sm">🔒</span>
            <span className="text-xs">SSL Secured</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 text-white/20">
            <span className="text-sm">🛡️</span>
            <span className="text-xs">Powered by Paystack</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 text-white/20">
            <span className="text-sm">⚡</span>
            <span className="text-xs">Instant Credit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundWallet;
