import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.post("/fund", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.balance += Number(amount);
    await wallet.save();

    const reference = "FUND-" + Date.now();

    await Transaction.create({
      user: req.user._id,
      type: "credit",
      amount,
      reference,
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
});

router.get("/transaction/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transaction = await Transaction.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json({ transaction });
  } catch (error) {
    console.error(" GET TRANSACTIONS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
