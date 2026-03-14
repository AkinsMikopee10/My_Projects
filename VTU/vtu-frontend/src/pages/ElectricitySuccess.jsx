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

  return (
    <div className="p-6 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-green-600 mb-2">
        Purchase Successful
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Your electricity token has been generated
      </p>

      {/* Token Display — prominent */}
      <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-xl mb-6">
        <p className="text-sm text-yellow-600 font-semibold mb-1">Your Token</p>
        <p className="text-2xl font-bold tracking-widest text-yellow-800">
          {token}
        </p>
        <p className="text-sm text-yellow-600 mt-1">{units} units</p>
      </div>

      {/* Details */}
      <div className="border p-4 rounded-xl mb-6 space-y-3 text-left">
        <div className="flex justify-between">
          <span className="text-gray-500">Provider</span>
          <span className="font-semibold">{providerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Meter Type</span>
          <span className="font-semibold capitalize">{meterType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Meter Number</span>
          <span className="font-semibold">{meterNumber}</span>
        </div>
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

export default ElectricitySuccess;
