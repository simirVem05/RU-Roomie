// routes/match.routes.js
import Match from "../models/match.model.js";
import Profile from "../models/profile.model.js";

router.get("/", auth, async (req, res) => {
  const me = req.profile;

  const matches = await Match.find({ users: me._id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ ok: true, data: { matches } });
});
