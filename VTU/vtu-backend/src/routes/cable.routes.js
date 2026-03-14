import express from "express";
import { getCablePlans, buyCable } from "../controllers/cable.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/plans", getCablePlans);
router.post("/buy", authMiddleware, buyCable);

export default router;
