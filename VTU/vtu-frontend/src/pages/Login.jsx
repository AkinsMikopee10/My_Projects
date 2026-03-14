import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
