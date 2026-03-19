import DataPlan from "../models/DataPlan.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import crypto from "crypto";
import { buyDataFromAnyAPI } from "../services/apiSelector.service.js";

/**
 * GET DATA PLANS
 */
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
    if (!wallet || wallet.balance < plan.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    if (wallet.status === "suspended") {
      return res.status(403).json({ message: "Wallet is suspended" });
    }

    const reference = crypto.randomUUID();

    const transaction = await Transaction.create({
      user: userId,
      type: "data",
      plan: plan._id,
      amount: plan.price,
      reference,
      status: "pending",
      metadata: { phone, plan: plan._id },
    });

    // Simulated API response (replace with real API later)
    const apiResult = {
      status: "success",
      message: "Data activated successfully",
    };

    if (apiResult.status !== "success") {
      transaction.status = "failed";
      transaction.metadata.apiResponse = apiResult;
      await transaction.save();
      return res.status(400).json({ message: "Data purchase failed" });
    }

    wallet.balance -= plan.price;
    await wallet.save();

    transaction.status = "successful";
    transaction.apiResponse = apiResult;
    await transaction.save();

    res.json({
      message: "Data purchase successful",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Data purchase error" });
  }
};
