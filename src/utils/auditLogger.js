import AuditLog from "../models/AuditLog.js";

export const logAudit = async ({
  actor,
  action,
  targetType,
  targetId,
  details
}) => {
  await AuditLog.create({
    actor,
    action,
    targetType,
    targetId,
    details
  });
};
