import DataPlan from "../models/DataPlan.js";
import DataTransaction from "../models/DataTransaction.js";
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

    const transaction = await DataTransaction.create({
      user: userId,
      plan: plan._id,
      phone,
      amount: plan.price,
      reference: crypto.randomUUID(),
      status: "pending",
    });

    wallet.balance -= plan.price;
    await wallet.save();

    const apiResult = await buyDataFromAnyAPI({
      phone,
      planCode: plan.planCode,
      amount: plan.costPrice,
      reference: transaction.reference,
    });

    if (apiResult.status !== "success") {
      transaction.status = "failed";
      transaction.apiResponse = apiResult;
      await transaction.save();

      wallet.balance += plan.price;
      await wallet.save();

      return res
        .status(400)
        .json({ message: "Transaction failed, wallet refunded" });
    }

    transaction.status = "successful";
    transaction.apiResponse = apiResult;
    await transaction.save();

    res.json({
      message: "Data purchase successful",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Data purchase error" });
  }
};
