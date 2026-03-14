import express from "express";
import { fundWallet, updateDataPlan } from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";

const router = express.Router();

router.post("/fund-wallet", authMiddleware, isAdmin, fundWallet);
router.patch("/data-plan/:id", authMiddleware, isAdmin, updateDataPlan);

export default router;
