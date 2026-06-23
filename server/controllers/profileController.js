import Profile from '../models/Profile.js';
import { DEFAULT_CREDITS_REQUIRED } from '../config/constants.js';

export const getProfile = async (_req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({
        studentName: 'Student',
        studentId: '',
        totalCreditsRequired: DEFAULT_CREDITS_REQUIRED,
        completedCredits: 0,
        enrolledCourses: []
      });
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    req.body.updatedAt = new Date();
    const profile = await Profile.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
};
