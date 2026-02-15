import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import airtimeRoutes from "./routes/airtime.routes.js";
import dataRoutes from "./routes/data.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/airtime", airtimeRoutes);
app.use("/api/data", dataRoutes);

app.get("/", (req, res) => {
  res.json({ message: "VTU API running" });
});

export default app;
