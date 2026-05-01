const express = require("express");
const cors = require("cors");

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

// Placeholder — routes will be added here Day 5+
// app.use('/api/jobs', jobRoutes);
// app.use('/api/auth', authRoutes);

module.exports = app;
