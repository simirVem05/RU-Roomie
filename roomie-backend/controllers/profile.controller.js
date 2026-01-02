import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';

export const createProfile = async(req, res, next) => {
    try {
        const { clerkUserId, ...profileData} = req.body;

        if(!clerkUserId){
            const error = new Error('clerkUserId is required.');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ clerkUserId })
        if(!user){
          const error = new Error("User not found");
          error.statusCode = 404;
          throw error;
        }

        const profile = await Profile.findOneAndUpdate(
            { user: user._id },
            { user: user._id, ...profileData },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            data: { profile },
        });
    } catch(error) {
        next(error);
    }
};

export const getProfileByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ user: userId }).populate('user');

    if (!profile) {
      const error = new Error('Profile not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: 'success',
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOnboardingStep = async (req, res, next) => {
  try {
    const { clerkUserId, step } = req.body;

    if (!clerkUserId || !step) {
      const error = new Error("clerkUserId and step are required.");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const profile = await Profile.findOneAndUpdate(
      { user: user._id },
      { onboardingStep: step },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileByClerkUser = async (req, res, next) => {
  try {
    const { clerkUserId } = req.params;

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const profile = await Profile.findOne({ user: user._id });

    res.status(200).json({
      status: "success",
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};