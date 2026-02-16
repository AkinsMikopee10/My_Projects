import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login success:", data);

      // Save token
      localStorage.setItem("token", data.token);

      // Redirect
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

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
          placeholder="Email........"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Password....."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
