import CablePlan from "../models/CablePlan.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import crypto from "crypto";
import { buyCableFromAnyAPI } from "../services/apiSelector.service.js";

export const getCablePlans = async (req, res) => {
  try {
    const plans = await CablePlan.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cable plans" });
  }
};

export const buyCable = async (req, res) => {
  try {
    const { planId, smartCardNumber } = req.body;
    const userId = req.user.id;

    const plan = await CablePlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(400).json({ message: "Invalid cable plan" });
    }

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    if (wallet.status === "suspended") {
      return res.status(403).json({ message: "Wallet is suspended" });
    }
    if (wallet.balance < plan.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const reference = `CABLE-${crypto.randomUUID()}`;

    const transaction = await Transaction.create({
      user: userId,
      type: "cable",
      amount: plan.price,
      reference,
      status: "pending",
      metadata: { smartCardNumber, plan: plan._id },
    });

    // Call real API
    const apiResult = await buyCableFromAnyAPI({
      smartCardNumber,
      planCode: plan.planCode,
      provider: plan.provider,
      amount: plan.costPrice,
      reference,
    });

    if (apiResult.status !== "success") {
      transaction.status = "failed";
      transaction.metadata.apiResponse = apiResult;
      await transaction.save();
      return res.status(400).json({
        message: apiResult.message || "Cable subscription failed",
      });
    }

    wallet.balance -= plan.price;
    await wallet.save();

    transaction.status = "successful";
    transaction.metadata.apiResponse = apiResult;
    await transaction.save();

    res.json({
      message: "Cable subscription successful",
      transaction,
    });
  } catch (error) {
    console.error("CABLE ERROR:", error);
    res.status(500).json({ message: "Cable purchase error" });
  }
};