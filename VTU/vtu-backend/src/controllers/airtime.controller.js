import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import crypto from "crypto";
import { buyAirtimeFromAnyAPI } from "../services/apiSelector.service.js";

export const buyAirtime = async (req, res) => {
  try {
    const { network, phone, amount } = req.body;
    const userId = req.user.id;

    if (!network || !phone || !amount) {
      return res.status(400).json({ message: "All fields are required" });
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

    const reference = `AIR-${crypto.randomUUID()}`;

    const transaction = await Transaction.create({
      user: userId,
      type: "airtime",
      amount,
      reference,
      status: "pending",
      metadata: { network, phone },
    });

    // Call real API
    const apiResult = await buyAirtimeFromAnyAPI({
      phone,
      network,
      amount,
      reference,
    });

    if (apiResult.status !== "success") {
      transaction.status = "failed";
      transaction.metadata.apiResponse = apiResult;
      await transaction.save();
      return res.status(400).json({
        message: apiResult.message || "Airtime purchase failed",
      });
    }

    // Debit wallet only on success
    wallet.balance -= amount;
    await wallet.save();

    transaction.status = "successful";
    transaction.metadata.apiResponse = apiResult;
    await transaction.save();

    res.json({
      message: "Airtime purchase successful",
      reference: transaction.reference,
    });
  } catch (error) {
    console.error("AIRTIME ERROR:", error);
    res.status(500).json({ message: "Airtime purchase error" });
  }
};