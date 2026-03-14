import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { api } from "../utils/api";

const typeIcons = {
  funding: "💰",
  airtime: "📞",
  data: "📶",
  cable: "📺",
  electricity: "💡",
};

const Receipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const receiptRef = useRef();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-6 text-center">Loading receipt...</div>;

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/transactions")}
          className="text-blue-600 font-semibold"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  if (!transaction) return <Navigate to="/transactions" replace />;

  const { type, amount, status, reference, createdAt, metadata } = transaction;
  const isElectricity = type === "electricity";
  const isSuccess = status === "successful";

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>

      <div className="p-6">
        {/* Header — hidden on print */}
        <div className="flex items-center mb-6 no-print">
          <button
            onClick={() => navigate("/transactions")}
            className="text-gray-500 mr-3 text-xl"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">Receipt</h1>
        </div>

        {/* Receipt Card */}
        <div ref={receiptRef} className="border rounded-2xl p-6 space-y-4">
          {/* Top */}
          <div className="text-center">
            <div className="text-5xl mb-2">{typeIcons[type] || "💳"}</div>
            <h2 className="text-lg font-bold capitalize">{type} Purchase</h2>
            <p
              className={`text-sm font-semibold mt-1 ${
                isSuccess
                  ? "text-green-600"
                  : status === "pending"
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {status.toUpperCase()}
            </p>
            <p className="text-2xl font-bold mt-2">
              ₦{amount.toLocaleString()}
            </p>
          </div>

          <hr />

          {/* Electricity Token — shown prominently */}
          {isElectricity && metadata?.apiResponse?.token && (
            <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-xl text-center">
              <p className="text-sm text-yellow-600 font-semibold mb-1">
                Electricity Token
              </p>
              <p className="text-xl font-bold tracking-widest text-yellow-800">
                {metadata.apiResponse.token}
              </p>
              {metadata?.apiResponse?.units && (
                <p className="text-sm text-yellow-600 mt-1">
                  {metadata.apiResponse.units} units
                </p>
              )}
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Reference</span>
              <span className="font-semibold text-xs text-right max-w-xs break-all">
                {reference}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Date</span>
              <span className="font-semibold text-sm">
                {new Date(createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Type</span>
              <span className="font-semibold text-sm capitalize">{type}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Amount</span>
              <span className="font-semibold text-sm">
                ₦{amount.toLocaleString()}
              </span>
            </div>

            {/* Airtime / Data fields */}
            {metadata?.phone && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Phone</span>
                <span className="font-semibold text-sm">{metadata.phone}</span>
              </div>
            )}

            {metadata?.network && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Network</span>
                <span className="font-semibold text-sm">
                  {metadata.network}
                </span>
              </div>
            )}

            {/* Electricity fields */}
            {metadata?.meterNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Meter Number</span>
                <span className="font-semibold text-sm">
                  {metadata.meterNumber}
                </span>
              </div>
            )}

            {metadata?.meterType && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Meter Type</span>
                <span className="font-semibold text-sm capitalize">
                  {metadata.meterType}
                </span>
              </div>
            )}

            {metadata?.providerCode && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Provider</span>
                <span className="font-semibold text-sm">
                  {metadata.providerCode}
                </span>
              </div>
            )}

            {/* Cable fields */}
            {metadata?.smartCardNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Smart Card No.</span>
                <span className="font-semibold text-sm">
                  {metadata.smartCardNumber}
                </span>
              </div>
            )}
          </div>

          <hr />

          {/* Footer */}
          <p className="text-center text-xs text-gray-400">
            Thank you for using our service
          </p>
        </div>

        {/* Action Buttons — hidden on print */}
        <div className="mt-6 space-y-3 no-print">
          <button
            onClick={handlePrint}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
          >
            🖨️ Print / Save Receipt
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="w-full bg-gray-200 text-gray-700 p-3 rounded-lg font-semibold"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    </>
  );
};

export default Receipt;
