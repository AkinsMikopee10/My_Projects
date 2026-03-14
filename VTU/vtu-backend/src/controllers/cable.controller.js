import CablePlan from "../models/CablePlan.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import crypto from "crypto";

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

    // Validate plan
    const plan = await CablePlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(400).json({ message: "Invalid cable plan" });
    }

    // Validate wallet
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

    const reference = crypto.randomUUID();

    // Create pending transaction
    const transaction = await Transaction.create({
      user: userId,
      type: "cable",
      amount: plan.price,
      reference,
      status: "pending",
      metadata: {
        smartCardNumber,
        plan: plan._id,
      },
    });

    // Simulate API call (replace with real API later)
    const apiResult = { status: "success", message: "Subscription activated" };

    if (apiResult.status !== "success") {
      transaction.status = "failed";
      transaction.metadata.apiResponse = apiResult;
      await transaction.save();
      return res.status(400).json({ message: "Cable subscription failed" });
    }

    // Debit wallet only on success
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
    console.error(error);
    res.status(500).json({ message: "Cable purchase error" });
  }
};
