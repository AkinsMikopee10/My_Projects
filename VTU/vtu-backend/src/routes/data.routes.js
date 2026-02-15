import express from "express";
import { getDataPlans, buyData } from "../controllers/data.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/plans", authMiddleware, getDataPlans);
router.post("/buy", authMiddleware, buyData);

export default router;
