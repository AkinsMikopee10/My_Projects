import { useLocation, useNavigate, Navigate } from "react-router-dom";

const ElectricitySuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    providerName,
    meterNumber,
    meterType,
    amount,
    phone,
    token,
    units,
    reference,
  } = location.state || {};

  if (!reference) return <Navigate to="/dashboard" replace />;

  const copyToken = () => {
    if (token) navigator.clipboard.writeText(token);
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans relative overflow-hidden flex flex-col">
      {/* Background orbs */}
      <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full bg-yellow-400 opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-40px] w-64 h-64 rounded-full bg-brand-primary opacity-10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex-1 px-5 pt-16 pb-10 flex flex-col animate-slideUp">
        {/* Success hero */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="absolute w-24 h-24 rounded-full bg-yellow-400/10 animate-ping opacity-30" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/30 to-brand-primary/20 border border-yellow-400/40 flex items-center justify-center text-3xl">
              ✓
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Purchase Successful!
          </h1>
          <p className="text-white/40 text-sm">
            Your electricity token has been generated
          </p>
        </div>

        {/* Token hero — most important element */}
        {token && (
          <div className="bg-yellow-400/10 border-2 border-yellow-400/40 rounded-2xl px-5 py-5 mb-4 text-center relative overflow-hidden">
            {/* Subtle grid texture */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,#eab308 0,#eab308 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#eab308 0,#eab308 1px,transparent 0,transparent 50%)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10">
              <p className="text-yellow-400/70 text-xs uppercase tracking-widest mb-3">
                Your Token
              </p>
              <p className="font-display text-2xl font-bold tracking-[0.25em] text-yellow-300 mb-2 break-all">
                {token}
              </p>
              {units && (
                <p className="text-yellow-400/60 text-sm mb-4">{units} units</p>
              )}
              <button
                onClick={copyToken}
                className="flex items-center gap-2 mx-auto bg-yellow-400/20 border border-yellow-400/30
                  text-yellow-300 text-xs font-semibold px-4 py-2 rounded-xl
                  hover:bg-yellow-400/30 active:scale-95 transition-all"
              >
                <span>📋</span> Copy Token
              </button>
            </div>
          </div>
        )}

        {/* Warning note */}
        <div className="flex items-start gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl px-4 py-3 mb-4">
          <span className="text-yellow-400 text-base leading-none mt-0.5">
            ⚠
          </span>
          <p className="text-white/50 text-xs leading-relaxed">
            Save this token before leaving. Enter it on your meter to activate
            your units.
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
            <div className="flex justify-between items-center px-5 py-3.5">
              <span className="text-white/50 text-sm">Provider</span>
              <span className="text-yellow-400 text-sm font-semibold">
                {providerName}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-3.5">
              <span className="text-white/50 text-sm">Meter Type</span>
              <span className="text-white text-sm font-semibold capitalize">
                {meterType}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-3.5">
              <span className="text-white/50 text-sm">Meter Number</span>
              <span className="text-white text-sm font-semibold tracking-widest">
                {meterNumber}
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-3.5">
              <span className="text-white/50 text-sm">Phone</span>
              <span className="text-white text-sm font-semibold">{phone}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3.5">
              <span className="text-white/50 text-sm">Amount Paid</span>
              <span className="text-white text-sm font-bold">
                ₦{Number(amount).toLocaleString()}
              </span>
            </div>
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

export default ElectricitySuccess;
