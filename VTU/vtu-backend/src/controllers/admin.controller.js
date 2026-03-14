import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import DataPlan from "../models/DataPlan.js";
import CablePlan from "../models/CablePlan.js";
import ElectricityProvider from "../models/ElectricityProvider.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ─── DASHBOARD STATS ───────────────────────────────────────────────
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalTransactions = await Transaction.countDocuments();

    const revenueResult = await Transaction.aggregate([
      { $match: { status: "successful" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email");

    const recentUsers = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    res.json({
      totalUsers,
      totalTransactions,
      totalRevenue,
      recentTransactions,
      recentUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// ─── USERS ─────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .select("-password");

    const usersWithWallets = await Promise.all(
      users.map(async (user) => {
        const wallet = await Wallet.findOne({ user: user._id });
        return {
          ...user.toObject(),
          balance: wallet?.balance || 0,
          walletStatus: wallet?.status || "active",
        };
      }),
    );

    res.json(usersWithWallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wallet = await Wallet.findOne({ user: user._id });
    const transactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      ...user.toObject(),
      balance: wallet?.balance || 0,
      walletStatus: wallet?.status || "active",
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.status = "suspended";
    await wallet.save();

    res.json({ message: "User wallet suspended successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to suspend user" });
  }
};

export const unsuspendUser = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.status = "active";
    await wallet.save();

    res.json({ message: "User wallet unsuspended successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to unsuspend user" });
  }
};

export const fundWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.balance += Number(amount);
    await wallet.save();

    await Transaction.create({
      user: userId,
      type: "funding",
      amount,
      reference: `ADMIN-FUND-${crypto.randomUUID()}`,
      status: "successful",
    });

    res.json({
      message: "Wallet funded successfully",
      balance: wallet.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fund wallet" });
  }
};

// ─── TRANSACTIONS ──────────────────────────────────────────────────
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

// ─── DATA PLANS ────────────────────────────────────────────────────
export const getAllDataPlans = async (req, res) => {
  try {
    const plans = await DataPlan.find().sort({ network: 1 });
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch data plans" });
  }
};

export const createDataPlan = async (req, res) => {
  try {
    const { network, planCode, planName, size, price, costPrice } = req.body;

    if (!network || !planCode || !planName || !size || !price || !costPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const plan = await DataPlan.create({
      network,
      planCode,
      planName,
      size,
      price,
      costPrice,
    });

    res.status(201).json({ message: "Data plan created", plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create data plan" });
  }
};

export const updateDataPlan = async (req, res) => {
  try {
    const { price, costPrice, isActive } = req.body;

    const plan = await DataPlan.findByIdAndUpdate(
      req.params.id,
      { price, costPrice, isActive },
      { new: true },
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "Data plan updated", plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update data plan" });
  }
};

export const deleteDataPlan = async (req, res) => {
  try {
    await DataPlan.findByIdAndDelete(req.params.id);
    res.json({ message: "Data plan deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete data plan" });
  }
};

// ─── CABLE PLANS ───────────────────────────────────────────────────
export const getAllCablePlans = async (req, res) => {
  try {
    const plans = await CablePlan.find().sort({ provider: 1 });
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cable plans" });
  }
};

export const createCablePlan = async (req, res) => {
  try {
    const { provider, planCode, planName, price, costPrice } = req.body;

    if (!provider || !planCode || !planName || !price || !costPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const plan = await CablePlan.create({
      provider,
      planCode,
      planName,
      price,
      costPrice,
    });

    res.status(201).json({ message: "Cable plan created", plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create cable plan" });
  }
};

export const updateCablePlan = async (req, res) => {
  try {
    const { price, costPrice, isActive } = req.body;

    const plan = await CablePlan.findByIdAndUpdate(
      req.params.id,
      { price, costPrice, isActive },
      { new: true },
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "Cable plan updated", plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update cable plan" });
  }
};

export const deleteCablePlan = async (req, res) => {
  try {
    await CablePlan.findByIdAndDelete(req.params.id);
    res.json({ message: "Cable plan deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete cable plan" });
  }
};

// ─── ELECTRICITY PROVIDERS ─────────────────────────────────────────
export const getAllElectricityProviders = async (req, res) => {
  try {
    const providers = await ElectricityProvider.find();
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
};

export const createElectricityProvider = async (req, res) => {
  try {
    const { name, providerCode, meterTypes } = req.body;

    if (!name || !providerCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const provider = await ElectricityProvider.create({
      name,
      providerCode,
      meterTypes,
    });

    res.status(201).json({ message: "Provider created", provider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create provider" });
  }
};

export const updateElectricityProvider = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    const provider = await ElectricityProvider.findByIdAndUpdate(
      req.params.id,
      { name, isActive },
      { new: true },
    );

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json({ message: "Provider updated", provider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update provider" });
  }
};
