const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { aggregateJobs } = require("./services/jobAggregator");

// Models (register on startup)
require("./models/Job");
require("./models/User");
require("./models/Application");
require("./models/UserJobMeta");

// Routes
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

// Middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Your Vite frontend
    credentials: true,
  }),
);
app.use(express.json()); // Parse incoming JSON request bodies

// Health check route — useful to confirm server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "JobPulse API is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Cron — fetch jobs every hour
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Cron: fetching new jobs...");
  await aggregateJobs();
});

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;
