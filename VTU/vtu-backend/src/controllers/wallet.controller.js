import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import crypto from "crypto";
import axios from "axios";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// ─── INITIALIZE PAYMENT ────────────────────────────────────────────
export const initializePayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (amount < 100) {
      return res
        .status(400)
        .json({ message: "Minimum funding amount is ₦100" });
    }

    const reference = `FUND-${crypto.randomUUID()}`;

    // Initialize payment with Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,
        amount: amount * 100, // Paystack uses kobo
        reference,
        callback_url: `${process.env.FRONTEND_URL}/wallet/verify`,
        metadata: {
          userId: req.user._id,
          amount,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url, reference: paystackRef } =
      response.data.data;

    // Create a pending transaction
    await Transaction.create({
      user: req.user._id,
      type: "funding",
      amount,
      reference: paystackRef,
      status: "pending",
    });

    res.json({
      authorization_url,
      reference: paystackRef,
    });
  } catch (error) {
    console.error("PAYSTACK INIT ERROR:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Payment initialization failed",
      detail: error.response?.data || error.message 
    });
  }
};

// ─── VERIFY PAYMENT ────────────────────────────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const { status, amount, metadata } = response.data.data;

    if (status !== "success") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Check if transaction already processed
    const transaction = await Transaction.findOne({ reference });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "successful") {
      return res.json({
        message: "Payment already processed",
        balance: await getWalletBalance(transaction.user),
      });
    }

    // Credit wallet
    const wallet = await Wallet.findOne({ user: transaction.user });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const amountInNaira = amount / 100; // convert from kobo
    wallet.balance += amountInNaira;
    await wallet.save();

    // Mark transaction successful
    transaction.status = "successful";
    await transaction.save();

    res.json({
      message: "Wallet funded successfully",
      balance: wallet.balance,
    });
  } catch (error) {
    console.error("PAYSTACK VERIFY ERROR:", error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// ─── WEBHOOK ───────────────────────────────────────────────────────
export const paystackWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const { event, data } = req.body;

    if (event === "charge.success") {
      const { reference, amount } = data;

      const transaction = await Transaction.findOne({ reference });
      if (!transaction || transaction.status === "successful") {
        return res.sendStatus(200);
      }

      const wallet = await Wallet.findOne({ user: transaction.user });
      if (!wallet) return res.sendStatus(200);

      const amountInNaira = amount / 100;
      wallet.balance += amountInNaira;
      await wallet.save();

      transaction.status = "successful";
      await transaction.save();
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("WEBHOOK ERROR:", error.message);
    res.sendStatus(500);
  }
};

// ─── GET BALANCE ───────────────────────────────────────────────────
export const getWalletBalance = async (userId) => {
  const wallet = await Wallet.findOne({ user: userId });
  return wallet ? wallet.balance : 0;
};

// ─── DIRECT FUND (Admin only — keep for admin use) ─────────────────
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