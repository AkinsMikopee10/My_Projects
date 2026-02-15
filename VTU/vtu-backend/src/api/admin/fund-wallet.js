import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export const fundWallet = async (req, res) => {
  const { userId, amount } = req.body;

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  const transaction = await Transaction.create({
    user: userId,
    type: "funding",
    amount,
    status: "pending",
    reference: `FUND_${Date.now()}`,
  });

  wallet.balance += amount;
  await wallet.save();

  transaction.status = "successful";
  await transaction.save();

  res.json({ message: "Wallet funded successfully" });
};
