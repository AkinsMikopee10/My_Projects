import { useLocation, useNavigate, Navigate } from "react-router-dom";

const TransactionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { phone, amount, network, reference, type, planName } =
    location.state || {};

  if (!reference) return <Navigate to="/dashboard" replace />;

  return (
    <div className="p-6 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-green-600 mb-2">
        Transaction Successful
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Your {type?.toLowerCase()} purchase was successful
      </p>

      <div className="border p-4 rounded-xl mb-6 space-y-3 text-left">
        <div className="flex justify-between">
          <span className="text-gray-500">Type</span>
          <span className="font-semibold">{type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Network</span>
          <span className="font-semibold">{network}</span>
        </div>
        {planName && (
          <div className="flex justify-between">
            <span className="text-gray-500">Plan</span>
            <span className="font-semibold">{planName}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Phone</span>
          <span className="font-semibold">{phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Amount</span>
          <span className="font-semibold">
            ₦{Number(amount).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Reference</span>
          <span className="font-semibold text-xs">{reference}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default TransactionSuccess;
