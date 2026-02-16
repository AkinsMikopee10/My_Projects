import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
