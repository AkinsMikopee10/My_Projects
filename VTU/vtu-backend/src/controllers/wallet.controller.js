import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import crypto from "crypto";

export const fundWallet = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.status === "suspended") {
      return res.status(403).json({ message: "Wallet is suspended" });
    }

    wallet.balance += Number(amount);
    await wallet.save();

    await Transaction.create({
      user: req.user._id,
      type: "funding",
      amount,
      reference: `FUND-${crypto.randomUUID()}`,
      status: "successful",
    });

    res.json({
      message: "Wallet funded successfully",
      balance: wallet.balance,
    });
  } catch (error) {
    console.error("FUND ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
