import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getTransactions,
  getTransactionById,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.get("/:id", authMiddleware, getTransactionById);

export default router;
