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
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-8 relative overflow-hidden font-sans">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-primary -top-36 -right-24 blur-[80px] opacity-35" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-accent -bottom-24 -left-20 blur-[80px] opacity-35" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-red-400 top-[40%] left-[30%] blur-[80px] opacity-15" />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-[440px] bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-10 animate-slideUp">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 2L4 13h7l-2 9 11-12h-7l2-8z"
                  fill="white"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="font-display text-[22px] font-extrabold text-white tracking-tight">
              Beta
              <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Plug
              </span>
            </div>
          </div>

          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 rounded-full px-3 py-1 text-[11px] text-brand-accent font-semibold uppercase tracking-wide mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
            Your Plug for Better Value
          </div>

          <h1 className="font-display text-[26px] font-extrabold text-white tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-white/45 mb-8">
            Sign in to your BetaPlug account
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-[13px] text-red-300 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[0.8px] mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 7L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white text-sm placeholder-white/25 outline-none focus:border-brand-primary focus:bg-brand-primary/[0.08] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[0.8px] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white text-sm placeholder-white/25 outline-none focus:border-brand-primary focus:bg-brand-primary/[0.08] transition-all"
                />
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-[13px] text-brand-primary/90 font-medium hover:text-brand-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 justify-center py-1">
              {["Secure Login", "SSL Encrypted", "2FA Ready"].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/[0.08] rounded-full px-3 py-1.5 text-[11px] text-white/45 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                  {label}
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 2L4 13h7l-2 9 11-12h-7l2-8z" />
              </svg>
              {loading ? "Signing in..." : "Sign In to BetaPlug"}
            </button>
          </form>

          <p className="text-center text-[13.5px] text-white/35 mt-5">
            New to BetaPlug?{" "}
            <Link
              to="/register"
              className="text-brand-primary font-semibold hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
