import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit profile state
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // Change password state
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

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

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

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-500 mr-3 text-xl"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">My Profile</h1>
      </div>

      {/* Avatar + Name */}
      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-3">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-bold">{profile.name}</h2>
        <p className="text-gray-500 text-sm">{profile.email}</p>
        <span
          className={`mt-2 text-xs px-3 py-1 rounded-full font-semibold ${
            profile.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {profile.role.toUpperCase()}
        </span>
      </div>

      {/* Wallet Info */}
      <div className="bg-blue-600 text-white p-4 rounded-xl">
        <p className="text-sm opacity-80">Wallet Balance</p>
        <p className="text-2xl font-bold">
          ₦{profile.balance.toLocaleString()}
        </p>
        <p
          className={`text-xs mt-1 ${
            profile.walletStatus === "active"
              ? "text-green-300"
              : "text-red-300"
          }`}
        >
          Wallet: {profile.walletStatus.toUpperCase()}
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white border rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Account Info</h3>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="text-blue-600 text-sm font-semibold"
            >
              Edit
            </button>
          )}
        </div>

        {updateSuccess && (
          <div className="bg-green-100 text-green-700 p-2 rounded-lg text-sm">
            {updateSuccess}
          </div>
        )}

        {editMode ? (
          <div className="space-y-3">
            {updateError && (
              <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm">
                {updateError}
              </div>
            )}
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpdateProfile}
                disabled={updateLoading}
                className="flex-1 bg-blue-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
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
                className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Full Name</span>
              <span className="font-semibold text-sm">{profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Email</span>
              <span className="font-semibold text-sm">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Member Since</span>
              <span className="font-semibold text-sm">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white border rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Security</h3>
          <button
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              setPasswordError("");
              setPasswordSuccess("");
            }}
            className="text-blue-600 text-sm font-semibold"
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>

        {passwordSuccess && (
          <div className="bg-green-100 text-green-700 p-2 rounded-lg text-sm">
            {passwordSuccess}
          </div>
        )}

        {showPasswordForm && (
          <div className="space-y-3">
            {passwordError && (
              <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm">
                {passwordError}
              </div>
            )}
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleChangePassword}
              disabled={passwordLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white border rounded-xl divide-y">
        <button
          onClick={() => navigate("/transactions")}
          className="w-full flex justify-between items-center p-4"
        >
          <span className="font-semibold">📜 Transaction History</span>
          <span className="text-gray-400">→</span>
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full flex justify-between items-center p-4"
        >
          <span className="font-semibold">🏠 Dashboard</span>
          <span className="text-gray-400">→</span>
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
