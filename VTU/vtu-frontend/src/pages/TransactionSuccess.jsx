import { useLocation, useNavigate, Navigate } from "react-router-dom";

const networkConfig = {
  MTN: {
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
  },
  GLO: {
    text: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
  },
  AIRTEL: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
  },
  "9MOBILE": {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
};

const typeIcon = {
  Airtime: "📶",
  Data: "🌐",
  Cable: "📺",
  Electricity: "⚡",
};

const TransactionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { phone, amount, network, reference, type, planName } =
    location.state || {};

  if (!reference) return <Navigate to="/dashboard" replace />;

  const net = networkConfig[network] || {
    text: "text-brand-accent",
    bg: "bg-brand-accent/10",
    border: "border-brand-accent/30",
  };
  const icon = typeIcon[type] || "✅";

  return (
    <div className="min-h-screen bg-brand-dark font-sans relative overflow-hidden flex flex-col">
      {/* Background orbs */}
      <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full bg-brand-accent opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-40px] w-64 h-64 rounded-full bg-brand-primary opacity-10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex-1 px-5 pt-16 pb-10 flex flex-col animate-slideUp">
        {/* Success hero */}
        <div className="text-center mb-8">
          {/* Animated checkmark ring */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="absolute w-24 h-24 rounded-full bg-brand-accent/10 animate-ping opacity-30" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-accent/30 to-brand-primary/20 border border-brand-accent/40 flex items-center justify-center text-3xl">
              ✓
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Transaction Successful!
          </h1>
          <p className="text-white/40 text-sm">
            Your {type?.toLowerCase()} purchase was completed
          </p>
        </div>

        {/* Service pill */}
        <div className="flex justify-center mb-5">
          <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-full px-4 py-2">
            <span className="text-base">{icon}</span>
            <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">
              {type} Purchase
            </span>
          </div>
        </div>

        {/* Amount hero */}
        <div className="bg-gradient-to-r from-brand-primary/20 to-brand-accent/10 border border-white/10 rounded-2xl px-5 py-5 text-center mb-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
            Amount Paid
          </p>
          <p className="font-display text-4xl font-bold text-white">
            ₦{Number(amount).toLocaleString()}
          </p>
        </div>

        {/* Details card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-white/5">
            <p className="text-white/30 text-xs uppercase tracking-widest">
              Transaction Details
            </p>
          </div>

          <div className="divide-y divide-white/5">
            {network && (
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-white/50 text-sm">Network</span>
                <span className={`text-sm font-semibold ${net.text}`}>
                  {network}
                </span>
              </div>
            )}
            {planName && (
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-white/50 text-sm">Plan</span>
                <span className="text-white text-sm font-semibold">
                  {planName}
                </span>
              </div>
            )}
            {phone && (
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-white/50 text-sm">Phone</span>
                <span className="text-white text-sm font-semibold tracking-wide">
                  {phone}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center px-5 py-3.5">
              <span className="text-white/50 text-sm">Status</span>
              <span className="flex items-center gap-1.5 text-brand-accent text-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent inline-block" />
                Successful
              </span>
            </div>
            <div className="flex justify-between items-start px-5 py-3.5">
              <span className="text-white/50 text-sm">Reference</span>
              <span className="text-white/60 text-xs font-mono text-right max-w-[55%] break-all">
                {reference}
              </span>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl px-4 py-3 mb-6">
          <span className="text-brand-accent text-base leading-none mt-0.5">
            ℹ
          </span>
          <p className="text-white/50 text-xs leading-relaxed">
            Save your reference number for support queries. You can view this
            transaction anytime in your history.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-auto">
          <button
            onClick={() => navigate("/transactions")}
            className="w-full py-4 rounded-2xl font-semibold text-white/70 text-sm
              bg-white/[0.04] border border-white/10
              hover:bg-white/[0.07] hover:text-white/90 transition-all"
          >
            View Transaction History
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 rounded-2xl font-display font-bold text-white text-base
              bg-gradient-to-r from-brand-primary to-brand-accent
              hover:opacity-90 active:scale-[0.98] transition-all
              shadow-lg shadow-brand-primary/25"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccess;
