import express from "express";
import {
  getElectricityProviders,
  buyElectricity,
} from "../controllers/electricity.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/providers", getElectricityProviders);
router.post("/buy", authMiddleware, buyElectricity);

export default router;
