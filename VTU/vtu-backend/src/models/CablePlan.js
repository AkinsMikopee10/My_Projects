import mongoose from "mongoose";

const cablePlanSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["DSTV", "GOTV", "STARTIMES"],
      required: true,
    },

    planCode: {
      type: String,
      required: true,
      unique: true,
    },

    planName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    costPrice: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CablePlan", cablePlanSchema);
