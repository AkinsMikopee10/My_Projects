import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { fundWallet } from "../controllers/wallet.controller.js";

const router = express.Router();

router.post("/fund", authMiddleware, fundWallet);

export default router;
