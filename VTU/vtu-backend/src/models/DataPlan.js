import mongoose from "mongoose";

const dataPlanSchema = new mongoose.Schema(
  {
    network: {
      type: String,
      enum: ["MTN", "GLO", "AIRTEL", "9MOBILE"],
      required: true,
    },
    serviceID: {
      type: String, // VTpass serviceID e.g "mtn-data", "glo-data"
      required: true,
    },
    planCode: {
      type: String, // VTpass variation_code e.g "mtn-10mb-100"
      required: true,
      unique: true,
    },
    planName: {
      type: String, // e.g "MTN 1.5GB - 30 days"
      required: true,
    },
    size: {
      type: String, // e.g "1.5GB"
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
  { timestamps: true },
);

export default mongoose.model("DataPlan", dataPlanSchema);
