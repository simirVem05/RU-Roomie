// routes/feed.routes.js
import Swipe from "../models/swipe.model.js";
import Match from "../models/match.model.js";
import Profile from "../models/profile.model.js";

router.get("/by-clerk/:clerkId", auth, async (req, res) => {
  const me = req.profile;
  const limit = Number(req.query.limit || 15);

  const currentSession = me.feedSessionIndex;

  // pull swipes that should exclude people right now
  const swipes = await Swipe.find({
    swiperProfile: me._id,
    $or: [
      { direction: "right" }, // exclude forever
      { direction: "left", sessionIndex: { $gt: currentSession - 4 } }, // exclude during cooldown window
    ],
  }).select("targetProfile direction sessionIndex");

  const excludeIds = swipes.map((s) => s.targetProfile);

  // also exclude users you already matched with (optional, but usually you want this)
  const myMatches = await Match.find({ users: me._id }).select("users");
  for (const m of myMatches) {
    const other = m.users.find((u) => u.toString() !== me._id.toString());
    if (other) excludeIds.push(other);
  }

  // Candidate profiles
  const candidates = await Profile.find({
    _id: { $ne: me._id, $nin: excludeIds },
    isOnboarded: true,
    onboardingStep: "complete",
  })
    .limit(limit);

  res.json({
    ok: true,
    data: { profiles: candidates, sessionIndex: currentSession },
  });
});
