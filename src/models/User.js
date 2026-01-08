import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isAdmin: Boolean,

  role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }
});


export default mongoose.model("User", userSchema);
