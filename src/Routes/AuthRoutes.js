import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Only fetch admin users
    const user = await User.findOne({ email, isAdmin: true });
    if (!user) return res.status(401).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// User login only
router.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Only fetch non-admin users
    const user = await User.findOne({ email, isAdmin: false });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "User login successful",
      token,
      user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;