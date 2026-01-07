
export const userOnly = (req, res, next) => {
  if (req.user.isAdmin) {
    return res.status(403).json({ message: "Users only" });
  }
  next();
};
