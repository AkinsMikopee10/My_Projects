import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const networks = [
  {
    id: "MTN",
    color: "from-yellow-400 to-yellow-500",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
    activeBg: "bg-yellow-400/20",
  },
  {
    id: "GLO",
    color: "from-green-400 to-green-500",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    text: "text-green-400",
    dot: "bg-green-400",
    activeBg: "bg-green-400/20",
  },
  {
    id: "AIRTEL",
    color: "from-red-400 to-red-500",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    text: "text-red-400",
    dot: "bg-red-400",
    activeBg: "bg-red-400/20",
  },
  {
    id: "9MOBILE",
    color: "from-emerald-400 to-teal-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    activeBg: "bg-emerald-400/20",
  },
];

const Data = () => {
  const navigate = useNavigate();
  const [network, setNetwork] = useState("MTN");
  const [phone, setPhone] = useState("");
  const [planId, setPlanId] = useState("");
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const data = await api("/api/data/plans");
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch plans:", err.message);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter((p) => p.network === network);
  const selectedPlan = plans.find((p) => p._id === planId);
  const activeNet = networks.find((n) => n.id === network);

  const handleBuyData = () => {
    setError("");
    if (!phone || !planId) return setError("Please fill in all fields");
    if (phone.length !== 11)
      return setError("Enter a valid 11-digit phone number");
    navigate("/data-confirm", {
      state: {
        network,
        phone,
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
            Buy Data
          </h1>
          <p className="text-xs text-white/40">
            Choose a plan and top up instantly
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

        {/* Network selector */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Select Network
          </p>
          <div className="grid grid-cols-4 gap-2">
            {networks.map((n) => {
              const isActive = network === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setNetwork(n.id);
                    setPlanId("");
                  }}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all
                    ${
                      isActive
                        ? `${n.activeBg} ${n.border} scale-[1.03]`
                        : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${n.dot}`} />
                  <span
                    className={`text-xs font-bold ${isActive ? n.text : "text-white/50"}`}
                  >
                    {n.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phone input */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Phone Number
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
              📱
            </span>
            <input
              type="text"
              placeholder="08012345678"
              value={phone}
              maxLength={11}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 py-4
                text-white placeholder-white/20 text-sm
                focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.06] transition-all"
            />
            {phone.length === 11 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-accent text-sm">
                ✓
              </span>
            )}
          </div>
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
                No plans available for {network}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {filteredPlans.map((p) => {
                const isSelected = planId === p._id;
                return (
                  <button
                    key={p._id}
                    onClick={() => setPlanId(p._id)}
                    className={`flex flex-col items-start gap-1 p-4 rounded-2xl border text-left transition-all
                      ${
                        isSelected
                          ? `${activeNet?.activeBg} ${activeNet?.border}`
                          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                      }`}
                  >
                    <span
                      className={`text-xs font-bold ${isSelected ? activeNet?.text : "text-white/60"}`}
                    >
                      {p.planName}
                    </span>
                    <span className="text-white text-base font-display font-bold">
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
            className={`${activeNet?.bg} border ${activeNet?.border} rounded-2xl px-5 py-4 space-y-2`}
          >
            <p className="text-white/40 text-xs uppercase tracking-widest">
              Order Summary
            </p>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Plan</span>
              <span className={`text-sm font-semibold ${activeNet?.text}`}>
                {selectedPlan.planName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Network</span>
              <span className="text-white text-sm font-semibold">
                {network}
              </span>
            </div>
            {phone.length === 11 && (
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">To</span>
                <span className="text-white text-sm font-semibold tracking-wide">
                  {phone}
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
          onClick={handleBuyData}
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

export default Data;
