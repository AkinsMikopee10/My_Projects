import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../utils/api";

const VerifyPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      navigate("/dashboard");
      return;
    }

    const verify = async () => {
      try {
        const data = await api(`/api/wallet/verify-payment/${reference}`);
        setBalance(data.balance);
        setStatus("success");
      } catch (err) {
        setError(err.message);
        setStatus("failed");
      }
    };

    verify();
  }, []);

  if (status === "verifying") {
    return (
      <div className="p-6 text-center mt-20">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-xl font-bold mb-2">Verifying Payment...</h1>
        <p className="text-gray-500 text-sm">Please wait, do not close this page</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-6 text-center mt-20">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <button
          onClick={() => navigate("/fund-wallet")}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 text-center mt-10">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-green-600 mb-2">
        Payment Successful!
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Your wallet has been funded successfully
      </p>

      <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg mb-6">
        <p className="text-sm opacity-80">New Wallet Balance</p>
        <p className="text-3xl font-bold mt-2">
          ₦{balance.toLocaleString()}
        </p>
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

export default VerifyPayment;