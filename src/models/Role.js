import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },

  permissions: [
    {
      permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
        required: true
      },
      validFrom: Date,
      validTill: Date
    }
  ]
});

export default mongoose.model("Role", roleSchema);
