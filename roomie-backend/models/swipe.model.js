import mongoose from "mongoose";

const swipeSchema = new mongoose.Schema(
  {
    swiperUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true, index: true },

    direction: { type: String, enum: ["left", "right"], required: true },

    // 0-based “session index” based on swipe count / 15
    sessionIndex: { type: Number, required: true, index: true },
  },
  { timestamps: true }
);

// one swipe per (swiperUser, targetProfile). If they swipe again later, we update it.
swipeSchema.index({ swiperUser: 1, targetProfile: 1 }, { unique: true });

export default mongoose.model("Swipe", swipeSchema);
