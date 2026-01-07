import Permission from "../models/permission.js";


const permissions = [
  { name: "VIEW_USERS", scope: "global" },
  { name: "VIEW_TEAM_USERS", scope: "team" },
  { name: "EDIT_PROFILE", scope: "self" },
  { name: "VIEW_AUDIT_LOGS", scope: "global" }
];

export const seedPermissions = async () => {
  for (const p of permissions) {
    await Permission.findOneAndUpdate(
      { name: p.name },
      p,
      { upsert: true }
    );
  }

  console.log("Permissions seeded");
};
