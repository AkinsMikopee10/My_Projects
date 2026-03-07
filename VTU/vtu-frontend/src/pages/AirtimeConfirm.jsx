import { useLocation, useNavigate } from "react-router-dom";

const AirtimeConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { phone, amount, network } = location.state || {};

  const confirmPurchase = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/airtime/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone, amount, network }),
    });

    const data = await res.json();

    navigate("/transaction-success", {
      state: {
        phone,
        amount,
        network,
        reference: data.reference || "TX-" + Date.now(),
      },
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold m-4">Confirm Airtime Purchase</h1>

      <div className="border p-4 rounded mb-4 space-y-2">
        <p>
          <strong>Network:</strong> {network}
        </p>
        <p>
          <strong>Phone:</strong> {phone}
        </p>
        <p>
          <strong>Amount:</strong> {amount}
        </p>
      </div>
      <button
        onClick={confirmPurchase}
        className="bg-green-500 text-white w-full p-2 rounded"
      >
        Confirm Purchase
      </button>
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300 w-full p-2 rounded mt-2"
      >
        Cancel
      </button>
    </div>
  );
};

export default AirtimeConfirm;
