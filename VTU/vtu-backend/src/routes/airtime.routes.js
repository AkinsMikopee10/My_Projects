import express from "express";
import { buyAirtime } from "../controllers/airtime.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/buy", authMiddleware, buyAirtime);

export default router;
