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
      enum: ["funding", "airtime"],
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
      apiResponse: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
