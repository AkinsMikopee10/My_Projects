import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  fundWallet,
  initializePayment,
  verifyPayment,
  paystackWebhook,
} from "../controllers/wallet.controller.js";

const router = express.Router();

// Webhook must use raw body — mount before express.json()
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paystackWebhook
);

router.post("/initialize-payment", authMiddleware, initializePayment);
router.get("/verify-payment/:reference", authMiddleware, verifyPayment);
router.post("/fund", authMiddleware, fundWallet);

export default router;