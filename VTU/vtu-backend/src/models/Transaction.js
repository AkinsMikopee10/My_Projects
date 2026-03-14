import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["funding", "airtime", "data", "cable", "electricity"],
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
      required: true,
    },

    metadata: {
      network: String,
      phone: String,
      plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DataPlan",
      },
      apiResponse: Object,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Transaction", transactionSchema);
