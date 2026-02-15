import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export const buyAirtime = async (req, res) => {
  try {
    const { network, phone, amount } = req.body;
    const userId = req.user.id; // from auth middleware

    // 1️⃣ Check wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 2️⃣ Create transaction (PENDING)
    const transaction = await Transaction.create({
      user: userId,
      type: "airtime",
      amount,
      reference: `AIR_${Date.now()}`,
      metadata: { network, phone },
    });

    // 3️⃣ Simulate VTU API call (for now)
    const apiResponse = {
      status: "success",
      message: "Airtime delivered",
    };

    // 4️⃣ Handle API response
    if (apiResponse.status === "success") {
      wallet.balance -= amount;
      await wallet.save();

      transaction.status = "successful";
      transaction.metadata.apiResponse = apiResponse;
      await transaction.save();

      return res.json({
        message: "Airtime purchase successful",
      });
    }

    // 5️⃣ If failed
    transaction.status = "failed";
    transaction.metadata.apiResponse = apiResponse;
    await transaction.save();

    res.status(400).json({ message: "Airtime purchase failed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
