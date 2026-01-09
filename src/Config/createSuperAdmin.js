// createSuperAdmin.js - COMPLETE VERSION
require('dotenv').config({ path: '../.env' });

const bcrypt = require("bcrypt");
const { User } = require("../models");

const createSuperAdmin = async () => {
  try {
    console.log("🔍 Loading SuperAdmin...");

    // ENV Debug
    console.log("📧 EMAIL:", process.env.SUPER_ADMIN_EMAIL || "MISSING");
    console.log("🔑 PASS:", process.env.SUPER_ADMIN_PASSWORD ? "SET" : "MISSING");

    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    
    if (!email || !password) {
      console.error("❌ .env में SUPER_ADMIN_EMAIL & SUPER_ADMIN_PASSWORD add करो!");
      return;
    }

    // Check existing
    console.log("🔍 Checking existing SuperAdmin...");
    const superAdmin = await User.findOne({ where: { role: "SUPER_ADMIN" } });
    
    if (superAdmin) {
      console.log("❌ Super Admin already exists:", superAdmin.email);
      return;
    }

    // Create
    console.log("✅ Creating SuperAdmin...");
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "Super Admin",
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      isEmailVerified: true,
      userType: null
    });

    console.log("🎉 SUPER ADMIN CREATED SUCCESSFULLY!");
    console.log(`📧 Login: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  } finally {
    console.log("🏁 Script finished!");
    process.exit(0);  // ✅ Force exit
  }
};

// 👇 AUTO RUN
createSuperAdmin();
