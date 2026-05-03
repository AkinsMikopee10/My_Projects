const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────
    externalId: {
      type: String,
      required: true,
      unique: true, // No duplicate jobs from the same API
    },
    source: {
      type: String,
      required: true,
      enum: ["adzuna", "remotive", "remoteok", "jsearch"], // Only these values allowed
    },

    // ── Core Info ─────────────────────────────────────────
    title: {
      type: String,
      required: true,
      trim: true, // Removes accidental leading/trailing spaces
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    isRemote: {
      type: Boolean,
      default: false,
    },

    // ── Description ───────────────────────────────────────
    description: {
      type: String,
      required: true,
    },
    descriptionHtml: {
      type: String, // Some APIs return HTML — store it raw
    },

    // ── Salary ────────────────────────────────────────────
    salary: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: "USD" },
      period: {
        type: String,
        enum: ["hourly", "monthly", "yearly", null],
        default: null,
      },
    },

    // ── Categorization ────────────────────────────────────
    category: {
      type: String,
      index: true, // We'll filter jobs by category often
    },
    tags: {
      type: [String], // e.g. ['React', 'Node.js', 'Remote']
      default: [],
    },
    jobType: {
      type: String,
      enum: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance",
        null,
      ],
      default: null,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", null],
      default: null,
    },

    // ── Links & Metadata ──────────────────────────────────
    applyUrl: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    postedAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },

    // ── Engagement Counters ───────────────────────────────
    viewCount: {
      type: Number,
      default: 0,
    },
    saveCount: {
      type: Number,
      default: 0,
    },
    applyCount: {
      type: Number,
      default: 0,
    },

    // ── Status ────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true, // Set to false when job expires
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// ── Indexes ─────────────────────────────────────────────────
// Full-text search across title, company, description
JobSchema.index({ title: "text", company: "text", description: "text" });

// Filter by location + sort by newest — most common query
JobSchema.index({ location: 1, postedAt: -1 });

// Filter by category + sort by newest
JobSchema.index({ category: 1, postedAt: -1 });

// Filter active jobs only
JobSchema.index({ isActive: 1, postedAt: -1 });

// Filter by source API
JobSchema.index({ source: 1 });

module.exports = mongoose.model("Job", JobSchema);