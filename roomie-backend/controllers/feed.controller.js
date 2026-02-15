import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Swipe from "../models/swipe.model.js";

const SESSION_SIZE = 15;
const COOLDOWN_SESSIONS = 4;

export const getFeed = async (req, res, next) => {
  try {
    const { clerkUserId } = req.params;
    const skip = Number(req.query.skip || 0);
    const limit = Math.min(Number(req.query.limit || 15), 50);

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Current session index based on how many swipes the user has already made
    const totalSwipes = await Swipe.countDocuments({ swiperUser: user._id });
    const currentSessionIndex = Math.floor(totalSwipes / SESSION_SIZE);

    // exclude:
    // - all right swipes forever
    // - left swipes only if still in cooldown window
    //   cooldown condition: currentSessionIndex < swipe.sessionIndex + 4
    //   equivalently: swipe.sessionIndex > currentSessionIndex - 4
    const recentLeftThreshold = currentSessionIndex - COOLDOWN_SESSIONS;

    const swipesToExclude = await Swipe.find({
      swiperUser: user._id,
      $or: [
        { direction: "right" },
        { direction: "left", sessionIndex: { $gt: recentLeftThreshold } },
      ],
    }).select("targetProfile");

    const excludedProfileIds = swipesToExclude.map((s) => s.targetProfile);

    // return only onboarded profiles, exclude current user AND excluded
    const profiles = await Profile.find({
      isOnboarded: true,
      user: { $ne: user._id },
      _id: { $nin: excludedProfileIds },
    })
      .populate("user", "name email clerkUserId")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      data: {
        profiles,
        skip,
        limit,
        currentSessionIndex,
        sessionSize: SESSION_SIZE,
        cooldownSessions: COOLDOWN_SESSIONS,
      },
    });
  } catch (e) {
    next(e);
  }
};
