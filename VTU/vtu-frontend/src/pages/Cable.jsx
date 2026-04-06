import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const providers = [
  {
    id: "DSTV",
    label: "DStv",
    icon: "📡",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    activeBg: "bg-blue-500/20",
    dot: "bg-blue-400",
  },
  {
    id: "GOTV",
    label: "GOtv",
    icon: "📺",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    activeBg: "bg-orange-500/20",
    dot: "bg-orange-400",
  },
  {
    id: "STARTIMES",
    label: "StarTimes",
    icon: "⭐",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    activeBg: "bg-purple-500/20",
    dot: "bg-purple-400",
  },
];

const Cable = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState("DSTV");
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [planId, setPlanId] = useState("");
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const data = await api("/api/cable/plans");
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch cable plans:", err.message);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter((p) => p.provider === provider);
  const selectedPlan = plans.find((p) => p._id === planId);
  const activeProv = providers.find((p) => p.id === provider);

  const handleContinue = () => {
    setError("");
    if (!smartCardNumber || !planId)
      return setError("Please fill in all fields");
    if (smartCardNumber.length < 10)
      return setError("Enter a valid smart card number");
    navigate("/cable-confirm", {
      state: {
        provider,
        smartCardNumber,
        planId,
        planName: selectedPlan?.planName,
        amount: selectedPlan?.price,
      },
    });
  };

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
            Cable TV
          </h1>
          <p className="text-xs text-white/40">
            Renew your subscription instantly
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

        {/* Provider selector */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Select Provider
          </p>
          <div className="grid grid-cols-3 gap-2">
            {providers.map((p) => {
              const isActive = provider === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setProvider(p.id);
                    setPlanId("");
                  }}
                  className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all
                    ${
                      isActive
                        ? `${p.activeBg} ${p.border} scale-[1.03]`
                        : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                    }`}
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span
                    className={`text-xs font-bold ${isActive ? p.text : "text-white/50"}`}
                  >
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart card input */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Smart Card / IUC Number
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
              💳
            </span>
            <input
              type="text"
              placeholder="Enter your card number"
              value={smartCardNumber}
              onChange={(e) =>
                setSmartCardNumber(e.target.value.replace(/\D/g, ""))
              }
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 py-4
                text-white placeholder-white/20 text-sm tracking-widest
                focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.06] transition-all"
            />
            {smartCardNumber.length >= 10 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-accent text-sm">
                ✓
              </span>
            )}
          </div>
          <p className="text-white/20 text-xs mt-2 pl-1">Minimum 10 digits</p>
        </div>

        {/* Plan selector */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Select Plan
          </p>
          {loadingPlans ? (
            <div className="flex items-center justify-center py-8 bg-white/[0.04] border border-white/10 rounded-2xl">
              <svg
                className="animate-spin w-5 h-5 text-brand-primary mr-2"
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
              <span className="text-white/40 text-sm">Loading plans...</span>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-8 bg-white/[0.04] border border-white/10 rounded-2xl">
              <p className="text-white/30 text-sm">
                No plans available for {provider}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredPlans.map((p) => {
                const isSelected = planId === p._id;
                return (
                  <button
                    key={p._id}
                    onClick={() => setPlanId(p._id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-all
                      ${
                        isSelected
                          ? `${activeProv?.activeBg} ${activeProv?.border}`
                          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? activeProv?.dot : "bg-white/20"}`}
                      />
                      <span
                        className={`text-sm font-semibold ${isSelected ? activeProv?.text : "text-white/60"}`}
                      >
                        {p.planName}
                      </span>
                    </div>
                    <span className="font-display text-base font-bold text-white">
                      ₦{p.price.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Live summary */}
        {selectedPlan && (
          <div
            className={`${activeProv?.bg} border ${activeProv?.border} rounded-2xl px-5 py-4 space-y-2`}
          >
            <p className="text-white/40 text-xs uppercase tracking-widest">
              Order Summary
            </p>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Provider</span>
              <span className={`text-sm font-semibold ${activeProv?.text}`}>
                {activeProv?.label}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Plan</span>
              <span className="text-white text-sm font-semibold">
                {selectedPlan.planName}
              </span>
            </div>
            {smartCardNumber.length >= 10 && (
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Card No.</span>
                <span className="text-white text-sm font-semibold tracking-widest">
                  {smartCardNumber}
                </span>
              </div>
            )}
            <div className="border-t border-white/10 pt-2 flex justify-between items-center">
              <span className="text-white/80 text-sm font-semibold">Total</span>
              <span className="font-display text-xl font-bold text-white">
                ₦{selectedPlan.price.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-display font-bold text-white text-base
            bg-gradient-to-r from-brand-primary to-brand-accent
            hover:opacity-90 active:scale-[0.98] transition-all
            shadow-lg shadow-brand-primary/25"
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default Cable;
