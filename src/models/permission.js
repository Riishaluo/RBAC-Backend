import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  scope: {
    type: String,
    enum: ["self", "team", "global"],
    required: true
  }
});

export default mongoose.model("Permission", permissionSchema);
