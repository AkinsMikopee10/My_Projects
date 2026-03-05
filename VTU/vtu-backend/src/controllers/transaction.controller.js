import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error("TRANSACTION FETCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
