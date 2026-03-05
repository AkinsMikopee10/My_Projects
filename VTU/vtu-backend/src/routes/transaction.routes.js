import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getTransactions } from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/transactions", authMiddleware, getTransactions);

export default router;
