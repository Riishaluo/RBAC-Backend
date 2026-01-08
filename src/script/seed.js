import mongoose from "mongoose";
import Role from "../models/Role.js";

await mongoose.connect("mongodb+srv://riishaluo:riishaluo9562@cluster0.2ob7lqq.mongodb.net/?appName=Cluster0");

const roles = await Role.find();
if (roles.length === 0) {
  await Role.insertMany([
    { name: "ADMIN" },
    { name: "USER" }
  ]);
  console.log("Roles seeded");
} else {
  console.log("Roles already exist");
}

process.exit();
