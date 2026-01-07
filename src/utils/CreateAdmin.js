import bcrypt from "bcrypt";
import User from "../models/User.js";

export const createAdminIfNotExists = async () => {
  const adminEmail = "admin@gmail.com";

  const admin = await User.findOne({ email: adminEmail });
  if (admin) return;

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    email: adminEmail,
    password: hashedPassword,
    isAdmin: true
  });

  console.log("✅ Default admin created");
};
