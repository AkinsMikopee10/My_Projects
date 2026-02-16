import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import Wallet from "../models/Wallet.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user._id });

  res.json({
    ...req.user.toObject(),
    balance: wallet ? wallet.balance : 0,
  });
});

export default router;
