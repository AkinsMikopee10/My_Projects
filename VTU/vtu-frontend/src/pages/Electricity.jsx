import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

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
    if (!providerCode || !meterNumber || !meterType || !amount || !phone) {
      setError("Please fill in all fields");
      return;
    }
    if (meterNumber.length < 11) {
      setError("Enter a valid meter number");
      return;
    }
    if (phone.length !== 11) {
      setError("Enter a valid 11-digit phone number");
      return;
    }
    if (Number(amount) < 100) {
      setError("Minimum amount is ₦100");
      return;
    }
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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-500 mr-3 text-xl"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Buy Electricity</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Provider Selection */}
        <select
          value={providerCode}
          onChange={(e) => setProviderCode(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loadingProviders ? (
            <option>Loading providers...</option>
          ) : (
            providers.map((p) => (
              <option key={p._id} value={p.providerCode}>
                {p.name}
              </option>
            ))
          )}
        </select>

        {/* Meter Type */}
        <select
          value={meterType}
          onChange={(e) => setMeterType(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="prepaid">Prepaid</option>
          <option value="postpaid">Postpaid</option>
        </select>

        {/* Meter Number */}
        <input
          type="text"
          placeholder="Meter Number"
          value={meterNumber}
          onChange={(e) => setMeterNumber(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Phone Number */}
        <input
          type="text"
          placeholder="Phone Number (e.g 08012345678)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount (min ₦100)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Electricity;
