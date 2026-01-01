import express from "express";
import {
    createProfile,
    getProfileByUser,
    updateOnboardingStep,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/by-user/:userId", getProfileByUser);
router.patch("/onboarding-step", updateOnboardingStep);

export default router;