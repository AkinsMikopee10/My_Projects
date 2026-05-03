const express = require("express");
const cors = require("cors");
const Job = require("./models/Job");
const cron = require("node-cron");
const { aggregateJobs } = require("./services/jobAggregator");

const app = express();

// Models (register on startup)
require("./models/Job");
require("./models/User");
require("./models/Application");
require("./models/UserJobMeta");

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

app.get("/api/test-schema", async (req, res) => {
  try {
    const count = await Job.countDocuments();
    res.json({ success: true, jobCount: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

cron.schedule("0 * * * *", async () => {
  console.log("⏰ Cron triggered: fetching new jobs...");
  await aggregateJobs();
});

// Placeholder — routes will be added here Day 5+
// app.use('/api/jobs', jobRoutes);
// app.use('/api/auth', authRoutes);

module.exports = app;
