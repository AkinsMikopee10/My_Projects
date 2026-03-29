import { useState } from "react";
import { useNavigate } from "react-router-dom";

const networks = [
  {
    value: "MTN",
    label: "MTN",
    color: "bg-yellow-400/10 border-yellow-400/30 text-yellow-300",
    active: "bg-yellow-400/20 border-yellow-400 text-yellow-300",
  },
  {
    value: "GLO",
    label: "GLO",
    color: "bg-green-500/10 border-green-500/30 text-green-300",
    active: "bg-green-500/20 border-green-500 text-green-300",
  },
  {
    value: "AIRTEL",
    label: "Airtel",
    color: "bg-red-500/10 border-red-500/30 text-red-300",
    active: "bg-red-500/20 border-red-500 text-red-300",
  },
  {
    value: "9MOBILE",
    label: "9mobile",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    active: "bg-emerald-500/20 border-emerald-500 text-emerald-300",
  },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

const Airtime = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("MTN");
  const [error, setError] = useState("");

  const handleBuyAirtime = () => {
    setError("");
    if (!phone || !amount) {
      setError("Please fill in all fields");
      return;
    }
    if (phone.length !== 11) {
      setError("Enter a valid 11-digit phone number");
      return;
    }
    if (Number(amount) < 50) {
      setError("Minimum airtime amount is ₦50");
      return;
    }
    navigate("/airtime-confirm", { state: { phone, amount, network } });
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen  bg-brand-dark font-sans pb-10">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute w-[350px] h-[350px] rounded-full bg-brand-primary -top-28 -right-16 blur-[80px] opacity-20" />
          <div className="absolute w-[250px] h-[250px] rounded-full bg-brand-accent -bottom-16 -left-12 blur-[80px] opacity-15" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              {" "}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <h1 className="font-display text-xl font-extrabold text-white tracking-tight">
              Buy Airtime
            </h1>
            <p className="text-white/35 text-xs">
              Top up any network instantly
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-[13px] text-red-300">
              {error}
            </div>
          )}

          {/* Network selector */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
              Select Network
            </p>
            <div className="grid grid-cols-4 gap-2">
              {networks.map((n) => (
                <button
                  key={n.value}
                  onClick={() => setNetwork(n.value)}
                  className={`border rounded-xl py-3 text-xs font-bold transition-all ${
                    network === n.value ? n.active : n.color
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[0.8px] mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <input
                type="tel"
                placeholder="e.g 08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white text-sm placeholder-white/25 outline-none focus:border-brand-primary focus:bg-brand-primary/[0.08] transition-all"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[0.8px] mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">
                ₦
              </div>
              <input
                type="number"
                placeholder="Min ₦50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3.5 pl-8 pr-4 text-white text-sm placeholder-white/25 outline-none focus:border-brand-primary focus:bg-brand-primary/[0.08] transition-all"
              />
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(String(amt))}
                  className={`border rounded-xl py-2 text-xs font-semibold transition-all ${
                    amount === String(amt)
                      ? "bg-brand-primary/20 border-brand-primary text-brand-primary"
                      : "bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Summary card */}
          {phone.length === 11 && Number(amount) >= 50 && (
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3.5 space-y-2">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">
                Summary
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Network</span>
                <span className="text-white font-semibold">{network}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Phone</span>
                <span className="text-white font-semibold">{phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Amount</span>
                <span className="text-brand-accent font-bold">
                  ₦{Number(amount).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleBuyAirtime}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-px active:translate-y-0 transition-all"
          >
            Continue
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Airtime;
