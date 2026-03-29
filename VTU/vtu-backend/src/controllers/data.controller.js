import DataPlan from "../models/DataPlan.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import crypto from "crypto";
import { buyDataFromAnyAPI } from "../services/apiSelector.service.js";

export const getDataPlans = async (req, res) => {
  try {
    const plans = await DataPlan.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data plans" });
  }
};

export const buyData = async (req, res) => {
  try {
    const { planId, phone } = req.body;
    const userId = req.user.id;

    const plan = await DataPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(400).json({ message: "Invalid data plan" });
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

    const reference = `DATA-${crypto.randomUUID()}`;

    const transaction = await Transaction.create({
      user: userId,
      type: "data",
      amount: plan.price,
      reference,
      status: "pending",
      metadata: { phone, plan: plan._id },
    });

    // Call real API
    const apiResult = await buyDataFromAnyAPI({
      phone,
      planCode: plan.planCode,
      amount: plan.costPrice,
      reference,
    });

    if (apiResult.status !== "success") {
      transaction.status = "failed";
      transaction.metadata.apiResponse = apiResult;
      await transaction.save();
      return res.status(400).json({
        message: apiResult.message || "Data purchase failed",
      });
    }

    // Debit wallet only on success
    wallet.balance -= plan.price;
    await wallet.save();

    transaction.status = "successful";
    transaction.metadata.apiResponse = apiResult;
    await transaction.save();

    res.json({
      message: "Data purchase successful",
      transaction,
    });
  } catch (error) {
    console.error("DATA ERROR:", error);
    res.status(500).json({ message: "Data purchase error" });
  }
};