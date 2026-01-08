import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/Routes/AuthRoutes.js";
import adminRoutes from "./src/Routes/AdminRoutes.js";
import userRoutes from './src/Routes/UserRoutes.js'
import { createAdminIfNotExists } from "./src/utils/CreateAdmin.js";

dotenv.config();
createAdminIfNotExists();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://rbac-frontend-q1tz-4k87l3i43-riishaluos-projects.vercel.app",
  "https://rbac-frontend-65jh.vercel.app",
  "https://rbac-frontend-tqb7.vercel.app",
  "https://rbac-frontend-5pr6.vercel.app",
  "https://rbac-frontend-5pr6-pxlv9ajy9-riishaluos-projects.vercel.app"
];

console.log("here")

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

const DB_URI = process.env.DB_URI

mongoose.connect(DB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.listen(9999, () => console.log("🚀 Server running on port 9999"));
