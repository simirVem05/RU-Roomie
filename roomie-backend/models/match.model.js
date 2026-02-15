import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],

    // for “first user sees it next time they open matches”
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Ensure only one match per pair (store sorted user ids)
matchSchema.index({ users: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);
