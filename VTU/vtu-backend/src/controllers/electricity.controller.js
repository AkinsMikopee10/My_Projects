import ElectricityProvider from "../models/ElectricityProvider.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import crypto from "crypto";

export const getElectricityProviders = async (req, res) => {
  try {
    const providers = await ElectricityProvider.find({ isActive: true });
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
};

export const buyElectricity = async (req, res) => {
  try {
    const { providerCode, meterNumber, meterType, amount, phone } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!providerCode || !meterNumber || !meterType || !amount || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount < 100) {
      return res
        .status(400)
        .json({ message: "Minimum electricity amount is ₦100" });
    }

    // Validate provider
    const provider = await ElectricityProvider.findOne({
      providerCode,
      isActive: true,
    });
    if (!provider) {
      return res.status(400).json({ message: "Invalid provider" });
    }

    // Validate wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    if (wallet.status === "suspended") {
      return res.status(403).json({ message: "Wallet is suspended" });
    }
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const reference = crypto.randomUUID();

    // Create pending transaction
    const transaction = await Transaction.create({
      user: userId,
      type: "electricity",
      amount,
      reference,
      status: "pending",
      metadata: {
        providerCode,
        meterNumber,
        meterType,
        phone,
      },
    });

    // Simulate API call (replace with real API later)
    const apiResult = {
      status: "success",
      token: "1234-5678-9012-3456-7890",
      units: (amount / 50).toFixed(2),
    };

    if (apiResult.status !== "success") {
      transaction.status = "failed";
      transaction.metadata.apiResponse = apiResult;
      await transaction.save();
      return res.status(400).json({ message: "Electricity purchase failed" });
    }

    // Debit wallet only on success
    wallet.balance -= amount;
    await wallet.save();

    transaction.status = "successful";
    transaction.metadata.apiResponse = apiResult;
    await transaction.save();

    res.json({
      message: "Electricity purchase successful",
      token: apiResult.token,
      units: apiResult.units,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Electricity purchase error" });
  }
};
