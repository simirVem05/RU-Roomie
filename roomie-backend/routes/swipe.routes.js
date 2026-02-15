// routes/swipe.routes.js
import Swipe from "../models/swipe.model.js";
import Match from "../models/match.model.js";

router.post("/", auth, async (req, res) => {
  const me = req.profile;
  const { targetProfileId, direction } = req.body;

  if (!targetProfileId || !["left", "right"].includes(direction)) {
    return res.status(400).json({ ok: false, error: "Invalid payload" });
  }

  const sessionIndex = me.feedSessionIndex;

  // upsert swipe
  await Swipe.updateOne(
    { swiperProfile: me._id, targetProfile: targetProfileId },
    { $set: { direction, sessionIndex } },
    { upsert: true }
  );

  // only check match on right swipe
  if (direction !== "right") {
    return res.json({ ok: true, matched: false });
  }

  // did the other person already swipe right on me?
  const reverse = await Swipe.findOne({
    swiperProfile: targetProfileId,
    targetProfile: me._id,
    direction: "right",
  }).select("_id");

  if (!reverse) {
    return res.json({ ok: true, matched: false });
  }

  // create match (unique pair)
  const users = [me._id.toString(), targetProfileId.toString()].sort();

  const match = await Match.findOneAndUpdate(
    { users },
    { $setOnInsert: { users } },
    { upsert: true, new: true }
  );

  // IMPORTANT: this is what triggers your instant modal for the SECOND swiper
  return res.json({ ok: true, matched: true, matchId: match._id });
});
