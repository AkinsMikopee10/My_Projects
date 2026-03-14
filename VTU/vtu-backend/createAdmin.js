import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import Wallet from "./src/models/Wallet.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({ email: "admin001@vtu.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin9949", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin001@vtu.com",
      password: hashedPassword,
      role: "admin",
    });

    await Wallet.create({
      user: admin._id,
    });

    console.log("✅ Admin created successfully");
    console.log("Email: admin001@vtu.com");
    console.log("Password: admin9949");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
