require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const { aggregateJobs } = require("../services/jobAggregator");

const run = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Run aggregation
    await aggregateJobs();
  } catch (err) {
    console.error("❌ Fatal error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

run();
