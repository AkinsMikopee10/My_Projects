import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import DataPlan from "../models/DataPlan.js";

export const fundWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Create transaction first (pending)
    const transaction = await Transaction.create({
      user: userId,
      type: "funding",
      amount,
      status: "pending",
      reference: `FUND_${Date.now()}`,
    });

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save();

    // Mark transaction successful
    transaction.status = "successful";
    await transaction.save();

    res.json({
      message: "Wallet funded successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDataPlan = async (req, res) => {
  const { price, isActive } = req.body;

  const plan = await DataPlan.findByIdAndUpdate(
    req.params.id,
    { price, isActive },
    { new: true }
  );

  res.json(plan);
};
