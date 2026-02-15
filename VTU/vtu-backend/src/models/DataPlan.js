import mongoose from "mongoose";

const dataPlanSchema = new mongoose.Schema(
  {
    network: {
      type: String,
      enum: ["MTN", "GLO", "AIRTEL", "9MOBILE"],
      required: true,
    },

    planCode: {
      type: String, // API plan code (e.g SME1GB)
      required: true,
      unique: true,
    },

    planName: {
      type: String, // e.g "MTN SME 1GB"
      required: true,
    },

    size: {
      type: String, // e.g "1GB"
      required: true,
    },

    price: {
      type: Number, // Selling price
      required: true,
    },

    costPrice: {
      type: Number, // API cost price
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DataPlan", dataPlanSchema);
