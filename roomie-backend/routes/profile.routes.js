import express from "express";
import {
    createProfile,
    getProfileByUser,
    updateOnboardingStep,
    getProfileByClerkUser,
    updateProfileByClerkUser
} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/by-user/:userId", getProfileByUser);
router.get("/by-clerk/:clerkUserId", getProfileByClerkUser);
router.patch("/onboarding-step", updateOnboardingStep);
router.patch("/by-clerk/:clerkUserId", updateProfileByClerkUser);

export default router;