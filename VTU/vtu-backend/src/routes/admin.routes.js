import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import {
  getAdminStats,
  getAllUsers,
  getUserById,
  suspendUser,
  unsuspendUser,
  fundWallet,
  getAllTransactions,
  getAllDataPlans,
  createDataPlan,
  updateDataPlan,
  deleteDataPlan,
  getAllCablePlans,
  createCablePlan,
  updateCablePlan,
  deleteCablePlan,
  getAllElectricityProviders,
  createElectricityProvider,
  updateElectricityProvider,
} from "../controllers/admin.controller.js";
import axios from "axios";

const router = express.Router();

// Apply auth + admin middleware to all routes
router.use(authMiddleware, isAdmin);

// Stats
router.get("/stats", getAdminStats);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/suspend", suspendUser);
router.patch("/users/:id/unsuspend", unsuspendUser);
router.post("/fund-wallet", fundWallet);

// Transactions
router.get("/transactions", getAllTransactions);

// Data Plans
router.get("/data-plans", getAllDataPlans);
router.post("/data-plans", createDataPlan);
router.patch("/data-plans/:id", updateDataPlan);
router.delete("/data-plans/:id", deleteDataPlan);

// Cable Plans
router.get("/cable-plans", getAllCablePlans);
router.post("/cable-plans", createCablePlan);
router.patch("/cable-plans/:id", updateCablePlan);
router.delete("/cable-plans/:id", deleteCablePlan);

// Electricity Providers
router.get("/electricity-providers", getAllElectricityProviders);
router.post("/electricity-providers", createElectricityProvider);
router.patch("/electricity-providers/:id", updateElectricityProvider);

// ── Temp diagnostic routes (DELETE before going to production) ──────────────

router.get("/vtpass-data-plans", async (req, res) => {
  try {
    const credentials = Buffer.from(
      `${process.env.VTPASS_EMAIL}:${process.env.VTPASS_PASSWORD}`,
    ).toString("base64");

    const networks = ["mtn-data", "glo-data", "airtel-data", "etisalat-data"];
    const results = {};

    for (const network of networks) {
      const response = await axios.get(
        `https://sandbox.vtpass.com/api/service-variations?serviceID=${network}`,
        { headers: { Authorization: `Basic ${credentials}` } },
      );
      results[network] = response.data;
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/vtpass-cable-plans", async (req, res) => {
  try {
    const credentials = Buffer.from(
      `${process.env.VTPASS_EMAIL}:${process.env.VTPASS_PASSWORD}`,
    ).toString("base64");

    const providers = ["dstv", "gotv", "startimes"];
    const results = {};

    for (const provider of providers) {
      const response = await axios.get(
        `https://sandbox.vtpass.com/api/service-variations?serviceID=${provider}`,
        { headers: { Authorization: `Basic ${credentials}` } },
      );
      results[provider] = response.data;
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
