import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getTransactions,
  getTransactionById,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.get("/:id", authMiddleware, getTransactionById);

router.get("/vtpass-services", authMiddleware, async (req, res) => {
  try {
    const axios = (await import("axios")).default;
    const credentials = Buffer.from(
      `${process.env.VTPASS_EMAIL}:${process.env.VTPASS_PASSWORD}`,
    ).toString("base64");

    const response = await axios.get(
      "https://sandbox.vtpass.com/api/services?identifier=telecoms",
      {
        headers: { Authorization: `Basic ${credentials}` },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
