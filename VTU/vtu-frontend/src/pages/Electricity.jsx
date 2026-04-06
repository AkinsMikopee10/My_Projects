import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

const Electricity = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [providerCode, setProviderCode] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState("prepaid");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      setLoadingProviders(true);
      try {
        const data = await api("/api/electricity/providers");
        setProviders(data);
        if (data.length > 0) setProviderCode(data[0].providerCode);
      } catch (err) {
        console.error("Failed to fetch providers:", err.message);
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, []);

  const selectedProvider = providers.find(
    (p) => p.providerCode === providerCode,
  );

  const handleContinue = () => {
    setError("");
    if (!providerCode || !meterNumber || !meterType || !amount || !phone)
      return setError("Please fill in all fields");
    if (meterNumber.length < 11) return setError("Enter a valid meter number");
    if (phone.length !== 11)
      return setError("Enter a valid 11-digit phone number");
    if (Number(amount) < 100) return setError("Minimum amount is ₦100");
    navigate("/electricity-confirm", {
      state: {
        providerCode,
        providerName: selectedProvider?.name,
        meterNumber,
        meterType,
        amount,
        phone,
      },
    });
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-80px] right-[-60px] w-72 h-72 rounded-full bg-yellow-400 opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full bg-brand-primary opacity-10 blur-3xl pointer-events-none" />

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
            Buy Electricity
          </h1>
          <p className="text-xs text-white/40">
            Pay your electricity bill instantly
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
            Distribution Company (DisCo)
          </p>
          {loadingProviders ? (
            <div className="flex items-center justify-center py-5 bg-white/[0.04] border border-white/10 rounded-2xl">
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
              <span className="text-white/40 text-sm">
                Loading providers...
              </span>
            </div>
          ) : (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 text-base pointer-events-none">
                ⚡
              </span>
              <select
                value={providerCode}
                onChange={(e) => setProviderCode(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 py-4
                  text-white text-sm appearance-none
                  focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.06] transition-all"
              >
                {providers.map((p) => (
                  <option
                    key={p._id}
                    value={p.providerCode}
                    className="bg-[#0a0f1e]"
                  >
                    {p.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none">
                ▾
              </span>
            </div>
          )}
        </div>

        {/* Meter type toggle */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Meter Type
          </p>
          <div className="grid grid-cols-2 gap-2">
            {["prepaid", "postpaid"].map((type) => {
              const isActive = meterType === type;
              return (
                <button
                  key={type}
                  onClick={() => setMeterType(type)}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-semibold text-sm transition-all
                    ${
                      isActive
                        ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400 scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.06]"
                    }`}
                >
                  <span>{type === "prepaid" ? "⚡" : "📋"}</span>
                  <span className="capitalize">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Meter number */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Meter Number
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
              🔢
            </span>
            <input
              type="text"
              placeholder="Enter meter number"
              value={meterNumber}
              onChange={(e) =>
                setMeterNumber(e.target.value.replace(/\D/g, ""))
              }
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 py-4
                text-white placeholder-white/20 text-sm tracking-widest
                focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.06] transition-all"
            />
            {meterNumber.length >= 11 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-accent text-sm">
                ✓
              </span>
            )}
          </div>
          <p className="text-white/20 text-xs mt-2 pl-1">Minimum 11 digits</p>
        </div>

        {/* Phone number */}
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

        {/* Amount */}
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
            Amount
          </p>
          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-bold">
              ₦
            </span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-9 pr-4 py-4
                text-white placeholder-white/20 text-sm font-display font-bold
                focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.06] transition-all"
            />
          </div>
          {/* Quick amounts */}
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(String(q))}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all
                  ${
                    amount === String(q)
                      ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"
                      : "bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.06]"
                  }`}
              >
                ₦{q.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Live summary */}
        {amount && Number(amount) >= 100 && selectedProvider && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-2xl px-5 py-4 space-y-2">
            <p className="text-white/40 text-xs uppercase tracking-widest">
              Order Summary
            </p>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Provider</span>
              <span className="text-yellow-400 text-sm font-semibold">
                {selectedProvider.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Meter Type</span>
              <span className="text-white text-sm font-semibold capitalize">
                {meterType}
              </span>
            </div>
            {meterNumber.length >= 11 && (
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Meter No.</span>
                <span className="text-white text-sm font-semibold tracking-widest">
                  {meterNumber}
                </span>
              </div>
            )}
            <div className="border-t border-white/10 pt-2 flex justify-between items-center">
              <span className="text-white/80 text-sm font-semibold">Total</span>
              <span className="font-display text-xl font-bold text-white">
                ₦{Number(amount).toLocaleString()}
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

export default Electricity;
