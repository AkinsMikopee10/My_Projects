const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Always store as lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // NEVER return password in queries by default
    },

    // ── Profile ───────────────────────────────────────────
    avatar: {
      type: String,
      default: null,
    },
    headline: {
      type: String, // e.g. "Full-Stack Developer | Open to Work"
      trim: true,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    skills: {
      type: [String], // e.g. ['JavaScript', 'Python', 'AWS']
      default: [],
    },

    // ── Job Preferences (for smart filtering) ─────────────
    preferences: {
      roles: { type: [String], default: [] }, // ['Frontend Developer', 'React Developer']
      locations: { type: [String], default: [] }, // ['Remote', 'Lagos']
      jobTypes: { type: [String], default: [] }, // ['full-time', 'contract']
      salaryMin: { type: Number, default: null },
      remote: { type: Boolean, default: false },
    },

    // ── Status ────────────────────────────────────────────
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ── Password Hashing ─────────────────────────────────────────
// Runs BEFORE saving — converts plain text to hash
UserSchema.pre("save", async function () {
  // Only hash if password was changed (not on profile updates)
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10); // 10 = cost factor (higher = slower = safer)
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance Method ──────────────────────────────────────────
// Call this to check a login attempt: user.matchPassword('abc123')
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Indexes ──────────────────────────────────────────────────
UserSchema.index({ skills: 1 }); // Future: match users to jobs

module.exports = mongoose.model("User", UserSchema);
