import express from "express";
import {
    createProfile,
    getProfileByUser,
    updateOnboardingStep,
    getProfileByClerkUser,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/by-user/:userId", getProfileByUser);
router.get("/by-clerk/:clerkUserId", getProfileByClerkUser);
router.patch("/onboarding-step", updateOnboardingStep);

export default router;