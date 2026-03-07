import { useLocation, useNavigate } from "react-router-dom";

const TransactionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { phone, amount, network, reference } = location.state || {};

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Transaction Successful
      </h1>

      <div className="border p-4 rounded mb-4 space-y-2 text-left">
        <p>
          <strong>Network:</strong> {network}
        </p>
        <p>
          <strong>Phone:</strong> {phone}
        </p>
        <p>
          <strong>Amount:</strong> {amount}
        </p>
        <p>
          <strong>Reference:</strong> {reference}
        </p>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-500 text-white w-full p-2 rounded mt-4"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default TransactionSuccess;
