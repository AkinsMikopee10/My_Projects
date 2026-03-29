import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  fundWallet,
  initializePayment,
  verifyPayment,
} from "../controllers/wallet.controller.js";

const router = express.Router();

router.post("/initialize-payment", authMiddleware, initializePayment);
router.get("/verify-payment/:reference", authMiddleware, verifyPayment);
router.post("/fund", authMiddleware, fundWallet);

export default router;