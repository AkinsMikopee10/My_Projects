import mongoose from "mongoose";

const electricityProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    providerCode: {
      type: String,
      required: true,
      unique: true,
    },

    meterTypes: {
      type: [String],
      enum: ["prepaid", "postpaid"],
      default: ["prepaid", "postpaid"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ElectricityProvider", electricityProviderSchema);
