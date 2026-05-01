const mongoose = require("mongoose");

const UserJobMetaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    isSaved: {
      type: Boolean,
      default: false, // Bookmarked / wishlist
    },
    isViewed: {
      type: Boolean,
      default: false, // Has the user opened this job?
    },
    viewedAt: {
      type: Date,
      default: null,
    },
    savedAt: {
      type: Date,
      default: null,
    },

    // Quick personal note without a full application
    note: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// One meta record per user+job pair
UserJobMetaSchema.index({ user: 1, job: 1 }, { unique: true });

// Fetch all saved jobs for a user fast
UserJobMetaSchema.index({ user: 1, isSaved: 1 });

module.exports = mongoose.model("UserJobMeta", UserJobMetaSchema);
