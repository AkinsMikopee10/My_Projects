import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Data = () => {
  const navigate = useNavigate();

  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");

  const handleBuyData = () => {
    navigate("/data-confirm", {
      state: {
        network,
        phone,
        plan,
      },
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Buy Data</h1>

      {/* Network Selection */}
      <select
        className="border w-full p-2 mb-2 rounded-lg"
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
      >
        <option>Select Network</option>
        <option>MTN</option>
        <option>Glo</option>
        <option>Airtel</option>
        <option>9Mobile</option>
      </select>

      {/* Phone Number Input */}
      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border p-2 rounded-lg mb-3 mt-1"
      />

      {/* Data Plan Selection */}
      <select
        className="border p-2 mb-2 w-full rounded-lg"
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
      >
        <option value="">Select Data Plan</option>
        <option value="500MB - ₦150">500MB - ₦150</option>
        <option value="1GB - ₦300">1GB - ₦300</option>
        <option value="2GB - ₦600">2GB - ₦600</option>
      </select>

      <button
        onClick={handleBuyData}
        className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold mt-4"
      >
        Buy Data
      </button>
    </div>
  );
};

export default Data;
