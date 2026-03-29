import ElectricityProvider from "../models/ElectricityProvider.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import crypto from "crypto";
import { buyElectricityFromAnyAPI } from "../services/apiSelector.service.js";

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

    if (!providerCode || !meterNumber || !meterType || !amount || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount < 100) {
      return res.status(400).json({
        message: "Minimum electricity amount is ₦100",
      });
    }

    const provider = await ElectricityProvider.findOne({
      providerCode,
      isActive: true,
    });
    if (!provider) {
      return res.status(400).json({ message: "Invalid provider" });
    }

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

    const reference = `ELEC-${crypto.randomUUID()}`;

    const transaction = await Transaction.create({
      user: userId,
      type: "electricity",
      amount,
      reference,
      status: "pending",
      metadata: { providerCode, meterNumber, meterType, phone },
    });

    // Call real API
    const apiResult = await buyElectricityFromAnyAPI({
      meterNumber,
      providerCode,
      meterType,
      amount,
      phone,
      reference,
    });

    if (apiResult.status !== "success") {
      transaction.status = "failed";
      transaction.metadata.apiResponse = apiResult;
      await transaction.save();
      return res.status(400).json({
        message: apiResult.message || "Electricity purchase failed",
      });
    }

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
    console.error("ELECTRICITY ERROR:", error);
    res.status(500).json({ message: "Electricity purchase error" });
  }
};