import Role from "../models/Role.js";


export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    const now = new Date();

    const roles = await Role.find({
      _id: { $in: req.user.roles }
    }).populate("permissions.permission");

    let matched = null;

    for (const role of roles) {
      for (const rp of role.permissions) {
        if (rp.permission.name === permissionName) {
          if (
            (rp.validFrom && rp.validFrom > now) ||
            (rp.validTill && rp.validTill < now)
          ) continue;

          matched = rp.permission;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      return res.status(403).json({ message: "Permission denied" });
    }

    req.permission = matched;
    next();
  };
};
