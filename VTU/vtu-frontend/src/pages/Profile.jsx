import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-4
        text-white placeholder-white/20 text-sm
        focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.06] transition-all"
    />
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api("/api/profile");
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setUpdateError("");
    setUpdateSuccess("");
    setUpdateLoading(true);
    try {
      const data = await api("/api/profile/update", {
        method: "PUT",
        body: JSON.stringify({ name, email }),
      });
      setProfile({ ...profile, name: data.user.name, email: data.user.email });
      setUpdateSuccess("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword)
      return setPasswordError("All fields are required");
    if (newPassword.length < 6)
      return setPasswordError("New password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return setPasswordError("New passwords do not match");
    setPasswordLoading(true);
    try {
      await api("/api/profile/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <svg
          className="animate-spin w-6 h-6 text-brand-primary mr-3"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <span className="text-white/40 text-sm">Loading profile...</span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-5 gap-4">
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 w-full max-w-sm">
          <span className="text-red-400 text-lg">⚠</span>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-brand-dark font-sans relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-80px] right-[-60px] w-72 h-72 rounded-full bg-brand-primary opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full bg-brand-accent opacity-10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-12 pb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          ←
        </button>
        <div>
          <h1 className="font-display text-lg font-bold text-white leading-tight">
            My Profile
          </h1>
          <p className="text-xs text-white/40">Manage your account</p>
        </div>
      </div>

      <div className="relative z-10 px-5 space-y-4 pb-10 animate-slideUp">
        {/* Avatar card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-6 text-center">
          {/* Avatar */}
          <div className="relative inline-flex mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center font-display text-2xl font-bold text-white shadow-lg shadow-brand-primary/30">
              {initials}
            </div>
            {profile.role === "admin" && (
              <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                👑
              </span>
            )}
          </div>

          <h2 className="font-display text-xl font-bold text-white mb-0.5">
            {profile.name}
          </h2>
          <p className="text-white/40 text-sm mb-3">{profile.email}</p>

          <div className="flex items-center justify-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full
              ${
                profile.role === "admin"
                  ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                  : "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
              }`}
            >
              {profile.role.toUpperCase()}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border
              ${
                profile.walletStatus === "active"
                  ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20"
                  : "bg-red-400/10 text-red-400 border-red-400/20"
              }`}
            >
              {profile.walletStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Wallet balance */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-px rounded-2xl">
          <div className="bg-[#0e1428] rounded-2xl px-5 py-4 flex justify-between items-center">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
                Wallet Balance
              </p>
              <p className="font-display text-2xl font-bold text-white">
                ₦{profile.balance.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => navigate("/fund-wallet")}
              className="bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-bold px-4 py-2.5 rounded-xl
                hover:opacity-90 active:scale-95 transition-all"
            >
              + Fund
            </button>
          </div>
        </div>

        {/* Success toasts */}
        {updateSuccess && (
          <div className="flex items-center gap-3 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl px-4 py-3">
            <span className="text-brand-accent">✓</span>
            <p className="text-brand-accent text-sm font-semibold">
              {updateSuccess}
            </p>
          </div>
        )}
        {passwordSuccess && (
          <div className="flex items-center gap-3 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl px-4 py-3">
            <span className="text-brand-accent">✓</span>
            <p className="text-brand-accent text-sm font-semibold">
              {passwordSuccess}
            </p>
          </div>
        )}

        {/* Account info card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
            <p className="text-white/60 text-sm font-bold">Account Info</p>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-brand-primary text-xs font-bold bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-xl hover:bg-brand-primary/20 transition-all"
              >
                Edit
              </button>
            )}
          </div>

          <div className="px-5 py-4 space-y-4">
            {editMode ? (
              <>
                {updateError && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
                    <span className="text-red-400 text-sm">⚠</span>
                    <p className="text-red-400 text-xs">{updateError}</p>
                  </div>
                )}
                <InputField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <InputField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={updateLoading}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-white text-sm
                      bg-gradient-to-r from-brand-primary to-brand-accent
                      disabled:opacity-50 hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setUpdateError("");
                      setName(profile.name);
                      setEmail(profile.email);
                    }}
                    className="flex-1 py-3.5 rounded-2xl font-semibold text-white/60 text-sm
                      bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="divide-y divide-white/5">
                {[
                  { label: "Full Name", value: profile.name },
                  { label: "Email", value: profile.email },
                  {
                    label: "Member Since",
                    value: new Date(profile.createdAt).toLocaleDateString(
                      "en-NG",
                      { day: "numeric", month: "long", year: "numeric" },
                    ),
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-3"
                  >
                    <span className="text-white/40 text-sm">{label}</span>
                    <span className="text-white text-sm font-semibold">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Security card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
            <p className="text-white/60 text-sm font-bold">Security</p>
            <button
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setPasswordError("");
              }}
              className="text-brand-primary text-xs font-bold bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-xl hover:bg-brand-primary/20 transition-all"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <div className="px-5 py-4 space-y-4">
              {passwordError && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
                  <span className="text-red-400 text-sm">⚠</span>
                  <p className="text-red-400 text-xs">{passwordError}</p>
                </div>
              )}
              <InputField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
              <InputField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
              />
              <InputField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm
                  bg-gradient-to-r from-brand-primary to-brand-accent
                  disabled:opacity-50 hover:opacity-90 active:scale-[0.98] transition-all
                  shadow-lg shadow-brand-primary/25"
              >
                {passwordLoading ? "Updating..." : "Update Password →"}
              </button>
            </div>
          )}

          {!showPasswordForm && (
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-sm">
                  🔒
                </div>
                <p className="text-white/30 text-xs">
                  Password last changed — tap to update
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
          {[
            { icon: "🧾", label: "Transaction History", path: "/transactions" },
            { icon: "🏠", label: "Dashboard", path: "/dashboard" },
          ].map(({ icon, label, path }, i) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.04] active:bg-white/[0.07] transition-all
                ${i > 0 ? "border-t border-white/5" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{icon}</span>
                <span className="text-white/70 text-sm font-semibold">
                  {label}
                </span>
              </div>
              <span className="text-white/20 text-sm">→</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl font-semibold text-red-400 text-sm
            bg-red-400/10 border border-red-400/20
            hover:bg-red-400/15 active:scale-[0.98] transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
