import express from "express";
import { protect } from "../middleware/AuthMiddleware.js";
import { userOnly } from "../middleware/userMiddleware.js";
import permission from "../models/permission.js";
import User from "../models/User.js";

const router = express.Router();


router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("team")  
      .select("-password"); 
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/teams/:id/users", protect, async (req, res) => {
  try {
    console.log("here")
    const users = await User.find({ team: req.params.id, isAdmin: false })
      .select("email _id"); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
