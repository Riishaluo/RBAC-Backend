import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  console.log("User found:", user);
  console.log("Entered password:", password);
  console.log("Stored hashed password:", user.password);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  console.log("Password match?", isMatch);
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  console.log("here")
  res.json({
    token,
    isAdmin: user.isAdmin
  });
});


router.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    console.log("here")
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("here " + token)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
