import { useState } from "react";

const Airtime = () => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("MTN");

  const handleBuyAirtime = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/airtime/buy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        amount,
        network,
      }),
    });

    const data = await res.json();

    alert(data.message || "Airtime purchase attempted");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Airtime</h1>

      {/* Network Selection */}

      <select
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
        className="w-full p-2 border mb-3"
      >
        <option value="MTN">MTN</option>
        <option value="Glo">Glo</option>
        <option value="Airtel">Airtel</option>
        <option value="9Mobile">9Mobile</option>
      </select>

      {/* Phone Number Input */}
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      {/* Amount Input */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      {/* Buy Button */}

      <button
        onClick={handleBuyAirtime}
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        Buy Airtime
      </button>
    </div>
  );
};

export default Airtime;
