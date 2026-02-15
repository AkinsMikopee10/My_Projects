import express from "express";
import { fundWallet } from "../controllers/admin.controller.js";
import { updateDataPlan } from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/fund-wallet", fundWallet);
router.patch("/data-plan/:id", authMiddleware, updateDataPlan);

export default router;
