import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Team from "../models/Team.js";
import Permission from "../models/permission.js";
import { protect } from "../middleware/AuthMiddleware.js";
import { adminOnly } from "../middleware/AdminMiddleware.js";
import { logAudit } from "../utils/auditLogger.js";

const router = express.Router();

/* Create User */
router.post("/users", protect, adminOnly, async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  await logAudit({
    actor: req.user._id,
    action: "CREATE_USER",
    targetType: "User",
    targetId: user._id
  });

  res.status(201).json(user);
});

/* Create Role */
router.post("/roles", protect, adminOnly, async (req, res) => {
  const role = await Role.create({ name: req.body.name });

  await logAudit({
    actor: req.user._id,
    action: "CREATE_ROLE",
    targetType: "Role",
    targetId: role._id
  });

  res.status(201).json(role);
});

/* Assign Permission to Role */
router.post("/roles/:id/permissions", protect, adminOnly, async (req, res) => {
  const { permissionId, validFrom, validTill } = req.body;

  await Role.findByIdAndUpdate(req.params.id, {
    $addToSet: {
      permissions: { permission: permissionId, validFrom, validTill }
    }
  });

  await logAudit({
    actor: req.user._id,
    action: "ASSIGN_PERMISSION",
    targetType: "Role",
    targetId: req.params.id
  });

  res.json({ message: "Permission assigned" });
});

/* Assign Role to User */
router.post("/assign-role", protect, adminOnly, async (req, res) => {
  const { userId, roleId } = req.body;

  await User.findByIdAndUpdate(userId, { $addToSet: { roles: roleId } });

  res.json({ message: "Role assigned" });
});

/* Create Team */
router.post("/teams", protect, adminOnly, async (req, res) => {
  const team = await Team.create({ name: req.body.name });
  res.status(201).json(team);
});

/* Assign Team */
router.post("/assign-team", protect, adminOnly, async (req, res) => {
  const { userId, teamId } = req.body;
  await User.findByIdAndUpdate(userId, { team: teamId });
  res.json({ message: "Team assigned" });
});

export default router;
