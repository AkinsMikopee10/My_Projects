import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-500 mr-3 text-xl"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Buy Airtime</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="MTN">MTN</option>
          <option value="GLO">GLO</option>
          <option value="AIRTEL">AIRTEL</option>
          <option value="9MOBILE">9MOBILE</option>
        </select>

        <input
          type="text"
          placeholder="Phone Number (e.g 08012345678)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Amount (min ₦50)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleBuyAirtime}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Airtime;
