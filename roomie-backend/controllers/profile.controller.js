import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';

export const createProfile = async(req, res, next) => {
    try {
        const { userId, ...profileData} = req.body;

        if(!userId){
            const error = new Error('UserID is required.');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findById(userId);
        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { user: userId, ...profileData },
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