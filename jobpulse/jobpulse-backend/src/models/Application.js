const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Links to the Job model
      required: true,
    },

    // ── Application Status Pipeline ───────────────────────
    status: {
      type: String,
      enum: [
        "saved", // Bookmarked, not yet applied
        "applied", // Submitted the application
        "interviewing", // Got a response, in process
        "offered", // Received an offer
        "rejected", // Got a rejection
        "withdrawn", // User pulled out
      ],
      default: "applied",
    },

    // ── Tracking ──────────────────────────────────────────
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    // ── Notes ─────────────────────────────────────────────
    notes: {
      type: String, // Private notes from the user
      default: null,
    },
    interviewDate: {
      type: Date,
      default: null,
    },

    // ── Source ────────────────────────────────────────────
    appliedVia: {
      type: String, // Where they applied from: 'jobpulse', 'direct', 'referral'
      default: "jobpulse",
    },
  },
  {
    timestamps: true,
  },
);

// ── Compound Unique Index ──────────────────────────────────────
// One user cannot apply to the same job twice
ApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

// Look up all applications by user
ApplicationSchema.index({ user: 1, status: 1 });

// Sort applications by most recent
ApplicationSchema.index({ appliedAt: -1 });

module.exports = mongoose.model("Application", ApplicationSchema);
