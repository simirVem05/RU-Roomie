import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Swipe from "../models/swipe.model.js";
import Match from "../models/match.model.js";

const SESSION_SIZE = 15;
const COOLDOWN_SESSIONS = 4;

export const swipeByClerk = async (req, res, next) => {
  try {
    const { clerkUserId } = req.params;
    const { targetProfileId, direction } = req.body;

    if (!targetProfileId || !["left", "right"].includes(direction)) {
      const error = new Error("targetProfileId and direction ('left'|'right') are required.");
      error.statusCode = 400;
      throw error;
    }

    const swiper = await User.findOne({ clerkUserId });
    if (!swiper) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const targetProfile = await Profile.findById(targetProfileId).populate("user", "_id");
    if (!targetProfile) {
      const error = new Error("Target profile not found");
      error.statusCode = 404;
      throw error;
    }

    // sessionIndex derived from how many swipes the user has already made
    const totalSwipes = await Swipe.countDocuments({ swiperUser: swiper._id });
    const sessionIndex = Math.floor(totalSwipes / SESSION_SIZE);

    // upsert swipe so repeated swipes overwrite
    await Swipe.findOneAndUpdate(
      { swiperUser: swiper._id, targetProfile: targetProfile._id },
      { direction, sessionIndex },
      { upsert: true, new: true }
    );

    // only check match on right swipes
    if (direction !== "right") {
      return res.status(200).json({
        status: "success",
        data: { matched: false, sessionIndex },
      });
    }

    // Check if the other user already swiped right on me
    const targetUserId = targetProfile.user?._id;
    const myProfile = await Profile.findOne({ user: swiper._id }).select("_id");
    if (!myProfile) {
      const error = new Error("Swiper profile not found");
      error.statusCode = 404;
      throw error;
    }

    const reciprocal = await Swipe.findOne({
      swiperUser: targetUserId,
      targetProfile: myProfile._id,
      direction: "right",
    });

    if (!reciprocal) {
      return res.status(200).json({
        status: "success",
        data: { matched: false, sessionIndex },
      });
    }

    // MATCH! create match doc (unique per pair)
    const pair = [swiper._id.toString(), targetUserId.toString()].sort();
    let match = await Match.findOne({ users: pair });
    if (!match) {
      match = await Match.create({ users: pair, seenBy: [swiper._id] }); 
      // second swiper sees modal immediately (this response)
      // first swiper will see it later in "get matches" because they won't be in seenBy yet
    } else {
      // ensure second swiper is marked as seen now
      if (!match.seenBy?.some((id) => id.toString() === swiper._id.toString())) {
        match.seenBy.push(swiper._id);
        await match.save();
      }
    }

    return res.status(200).json({
      status: "success",
      data: { matched: true, matchId: match._id, sessionIndex },
    });
  } catch (e) {
    next(e);
  }
};
