import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/AuthMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";
import Role from "../models/Role.js";

const router = express.Router();

router.get(
  "/users/:id",
  protect,
  checkPermission("VIEW_USERS"),
  async (req, res) => {
    const target = await User.findById(req.params.id);

    if (req.permission.scope === "self" &&
        req.user._id.toString() !== target._id.toString()) {
      return res.status(403).json({ message: "Self access only" });
    }

    if (req.permission.scope === "team" &&
        req.user.team?.toString() !== target.team?.toString()) {
      return res.status(403).json({ message: "Team access only" });
    }

    res.json(target);
  }
);




// GET /api/user/me
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("team", "name")
    .populate("roles", "name");

  if (!user) return res.status(404).json({ message: "User not found" });

  const now = new Date();

  const rolesWithPermissions = await Role.find({ _id: { $in: user.roles } })
    .populate("permissions.permission");

  const permissionMap = new Map();
  for (const role of rolesWithPermissions) {
    for (const rp of role.permissions) {
      const perm = rp.permission;
      if (!perm) continue;
      if ((rp.validFrom && rp.validFrom > now) || (rp.validTill && rp.validTill < now)) continue;
      if (!permissionMap.has(perm.name)) {
        permissionMap.set(perm.name, { name: perm.name, scope: perm.scope });
      }
    }
  }

  res.json({
    email: user.email,
    team: user.team,
    roles: user.roles.map(r => r.name),
    permissions: Array.from(permissionMap.values())
  });
});


export default router;