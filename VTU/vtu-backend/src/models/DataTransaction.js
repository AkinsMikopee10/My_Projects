import mongoose from "mongoose";

const dataTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DataPlan",
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },

    reference: {
      type: String,
      unique: true,
    },

    apiResponse: {
      type: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DataTransaction", dataTransactionSchema);
