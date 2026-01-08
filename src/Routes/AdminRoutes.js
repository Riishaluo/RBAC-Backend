import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { protect } from "../middleware/AuthMiddleware.js";
import { adminOnly } from "../middleware/AdminMiddleware.js";
import { logAudit } from "../utils/auditLogger.js";
import AuditLog from "../models/AuditLog.js";
import Team from "../models/Team.js";
import Role from "../models/Role.js";


const router = express.Router();

router.post("/create-user", protect, adminOnly, async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      isAdmin: false,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/update-user-role/:userId", protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || !["ADMIN", "USER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    // Find role document
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        role: [roleDoc._id],
        isAdmin: role === "ADMIN"
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});





router.post("/assign-permission", protect, adminOnly, async (req, res) => {
  const { userId, permissionId } = req.body;

  const user = await User.findById(userId).populate("role");
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.role.permissions.includes(permissionId)) {
    user.role.permissions.push(permissionId);
    await user.role.save();
  }

  res.json({ message: "Permission assigned" });
});


router.get("/audit-logs", protect, adminOnly, async (req, res) => {
  const logs = await AuditLog.find().populate("actor", "email");
  res.json(logs);
});


router.get("/roles", protect, adminOnly, async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("email roles isAdmin");
  res.json(users);
});

router.post("/teams", protect, adminOnly, async (req, res) => {
  const team = await Team.create({ name: req.body.name });

  await logAudit({
    actor: req.user._id,
    action: "CREATE_TEAM",
    targetType: "Team",
    targetId: team._id,
    details: "Team created"
  });

  res.status(201).json(team);
});


router.get("/teams", protect, adminOnly, async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});


router.post("/assign-team", protect, adminOnly, async (req, res) => {
  const { userId, teamId } = req.body;

  await User.findByIdAndUpdate(userId, { team: teamId });

  await logAudit({
    actor: req.user._id,
    action: "ASSIGN_TEAM",
    targetType: "User",
    targetId: userId,
    details: "User assigned to team"
  });

  res.json({ message: "Team assigned" });
});



export default router;
