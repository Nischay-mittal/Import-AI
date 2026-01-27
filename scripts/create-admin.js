require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Admin credentials
const ADMIN_EMAIL = "admin@importai.in";
const ADMIN_PASSWORD = "ImportAI@Admin2025!";
const ADMIN_NAME = "Admin User";

async function createAdmin() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.error("ERROR: MONGODB_URI is required in .env file");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, { dbName: "importai" });
    console.log("✓ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      // Update existing user to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log("✓ Updated existing user to admin role");
      } else {
        console.log("✓ Admin user already exists");
      }
      console.log("\n📧 Admin Credentials:");
      console.log("   Email:", ADMIN_EMAIL);
      console.log("   Password:", ADMIN_PASSWORD);
      console.log("\n⚠️  IMPORTANT: Change this password after first login!");
      await mongoose.disconnect();
      return;
    }

    // Create new admin user
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hash,
      role: 'admin'
    });

    console.log("✓ Admin user created successfully!");
    console.log("\n📧 Admin Credentials:");
    console.log("   Email:", ADMIN_EMAIL);
    console.log("   Password:", ADMIN_PASSWORD);
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");
    console.log("\n🔐 Security Note: Keep these credentials secure and change the password immediately!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("✗ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();

