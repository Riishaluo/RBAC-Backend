import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["ADMIN", "USER"],
    required: true
  },
});

export default mongoose.model("Role", roleSchema);

