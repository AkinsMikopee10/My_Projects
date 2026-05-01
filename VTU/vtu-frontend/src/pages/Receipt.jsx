import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { api } from "../utils/api";

const typeConfig = {
  funding: {
    icon: "💰",
    label: "Wallet Funding",
    bg: "bg-green-400/10",
    text: "text-green-400",
    border: "border-green-400/20",
  },
  airtime: {
    icon: "📞",
    label: "Airtime",
    bg: "bg-blue-400/10",
    text: "text-blue-400",
    border: "border-blue-400/20",
  },
  data: {
    icon: "📶",
    label: "Data Bundle",
    bg: "bg-brand-primary/10",
    text: "text-brand-primary",
    border: "border-brand-primary/20",
  },
  cable: {
    icon: "📺",
    label: "Cable TV",
    bg: "bg-orange-400/10",
    text: "text-orange-400",
    border: "border-orange-400/20",
  },
  electricity: {
    icon: "⚡",
    label: "Electricity",
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
    border: "border-yellow-400/20",
  },
};

const statusConfig = {
  successful: {
    text: "text-brand-accent",
    dot: "bg-brand-accent",
    label: "Successful",
  },
  pending: { text: "text-yellow-400", dot: "bg-yellow-400", label: "Pending" },
  failed: { text: "text-red-400", dot: "bg-red-400", label: "Failed" },
};

const Row = ({ label, value, mono = false, accent = false }) => (
  <div className="flex justify-between items-start gap-4 py-3.5 border-b border-white/5 last:border-0">
    <span className="text-white/40 text-sm flex-shrink-0">{label}</span>
    <span
      className={`text-sm text-right break-all
      ${mono ? "font-mono text-white/60 text-xs" : "font-semibold"}
      ${accent ? "text-brand-accent" : "text-white"}`}
    >
      {value}
    </span>
  </div>
);

const Receipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const receiptRef = useRef();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await api(`/api/transactions/${id}`);
        setTransaction(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  const handlePrint = () => window.print();

  const copyToken = (token) => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <svg
          className="animate-spin w-6 h-6 text-brand-primary mr-3"
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
        <span className="text-white/40 text-sm">Loading receipt...</span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-5 gap-4">
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 w-full max-w-sm">
          <span className="text-red-400 text-lg">⚠</span>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
        <button
          onClick={() => navigate("/transactions")}
          className="text-brand-primary text-sm font-semibold"
        >
          ← Back to Transactions
        </button>
      </div>
    );

  if (!transaction) return <Navigate to="/transactions" replace />;

  const { type, amount, status, reference, createdAt, metadata } = transaction;
  const cfg = typeConfig[type] || {
    icon: "💳",
    label: type,
    bg: "bg-white/10",
    text: "text-white/60",
    border: "border-white/10",
  };
  const stat = statusConfig[status] || statusConfig.failed;
  const isElectricity = type === "electricity";
  const electricityToken = metadata?.apiResponse?.token;
  const electricityUnits = metadata?.apiResponse?.units;

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-card { border: 1px solid #ddd !important; background: white !important; }
        }
      `}</style>

      <div className="min-h-screen bg-brand-dark font-sans relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-brand-primary opacity-10 blur-3xl pointer-events-none no-print" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-brand-accent opacity-10 blur-3xl pointer-events-none no-print" />

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3 px-5 pt-12 pb-6 no-print">
          <button
            onClick={() => navigate("/transactions")}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            ←
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-white leading-tight">
              Receipt
            </h1>
            <p className="text-xs text-white/40">Transaction details</p>
          </div>
        </div>

        <div className="relative z-10 px-5 pb-10 animate-slideUp">
          {/* Receipt card */}
          <div
            ref={receiptRef}
            className="print-card bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden mb-4"
          >
            {/* Hero */}
            <div
              className="border-b border-white/10 px-5 py-6 text-center"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(108,99,255,0.12), rgba(0,212,170,0.06))",
              }}
            >
              {/* BetaPlug brand — visible on print */}
              <p className="font-display text-xs text-white/20 uppercase tracking-widest mb-4">
                BetaPlug Receipt
              </p>

              <div
                className={`w-14 h-14 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center text-2xl mx-auto mb-3`}
              >
                {cfg.icon}
              </div>

              <p className={`text-sm font-bold mb-1 ${cfg.text}`}>
                {cfg.label}
              </p>
              <p className="font-display text-3xl font-bold text-white mb-2">
                ₦{amount.toLocaleString()}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${stat.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                {stat.label}
              </span>
            </div>

            {/* Electricity token — hero treatment */}
            {isElectricity && electricityToken && (
              <div className="border-b border-white/10 px-5 py-5 bg-yellow-400/5">
                <p className="text-yellow-400/60 text-xs uppercase tracking-widest text-center mb-3">
                  Electricity Token
                </p>
                <div
                  className="bg-yellow-400/10 border-2 border-yellow-400/30 rounded-2xl px-4 py-4 text-center relative"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg,rgba(234,179,8,0.03) 0,rgba(234,179,8,0.03) 1px,transparent 0,transparent 20px),repeating-linear-gradient(90deg,rgba(234,179,8,0.03) 0,rgba(234,179,8,0.03) 1px,transparent 0,transparent 20px)",
                  }}
                >
                  <p className="font-display text-xl font-bold tracking-[0.2em] text-yellow-300 break-all mb-1">
                    {electricityToken}
                  </p>
                  {electricityUnits && (
                    <p className="text-yellow-400/60 text-xs">
                      {electricityUnits} units
                    </p>
                  )}
                </div>
                <button
                  onClick={() => copyToken(electricityToken)}
                  className="flex items-center gap-2 mx-auto mt-3 bg-yellow-400/10 border border-yellow-400/20
                    text-yellow-300 text-xs font-semibold px-4 py-2 rounded-xl
                    hover:bg-yellow-400/20 active:scale-95 transition-all no-print"
                >
                  {copied ? "✓ Copied!" : "📋 Copy Token"}
                </button>
              </div>
            )}

            {/* Details */}
            <div className="px-5 py-2">
              <Row label="Reference" value={reference} mono />
              <Row
                label="Date"
                value={new Date(createdAt).toLocaleString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <Row label="Amount" value={`₦${amount.toLocaleString()}`} />

              {/* Airtime / Data */}
              {metadata?.phone && <Row label="Phone" value={metadata.phone} />}
              {metadata?.network && (
                <Row label="Network" value={metadata.network} />
              )}
              {metadata?.plan && (
                <Row
                  label="Plan"
                  value={metadata.plan?.planName || metadata.plan}
                />
              )}

              {/* Cable */}
              {metadata?.smartCardNumber && (
                <Row label="Smart Card No." value={metadata.smartCardNumber} />
              )}

              {/* Electricity */}
              {metadata?.meterNumber && (
                <Row label="Meter Number" value={metadata.meterNumber} />
              )}
              {metadata?.meterType && (
                <Row label="Meter Type" value={metadata.meterType} />
              )}
              {metadata?.providerCode && (
                <Row label="Provider" value={metadata.providerCode} />
              )}

              <Row label="Status" value={stat.label} accent />
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 px-5 py-4 text-center">
              <p className="text-white/20 text-xs">
                Thank you for using BetaPlug · Your Plug for Better Value
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 no-print">
            <button
              onClick={handlePrint}
              className="w-full py-4 rounded-2xl font-display font-bold text-white text-base
                bg-gradient-to-r from-brand-primary to-brand-accent
                hover:opacity-90 active:scale-[0.98] transition-all
                shadow-lg shadow-brand-primary/25"
            >
              🖨️ Print / Save Receipt
            </button>
            <button
              onClick={() => navigate("/transactions")}
              className="w-full py-4 rounded-2xl font-semibold text-white/60 text-sm
                bg-white/[0.04] border border-white/10
                hover:bg-white/[0.07] hover:text-white/80 transition-all"
            >
              ← Back to Transactions
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;
