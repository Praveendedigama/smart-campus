import mongoose from 'mongoose';
import { DEFAULT_CREDITS_REQUIRED } from '../config/constants.js';

const profileSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, default: '' },
  email: { type: String, default: '' },
  totalCreditsRequired: { type: Number, default: DEFAULT_CREDITS_REQUIRED },
  completedCredits: { type: Number, default: 0 },
  enrolledCourses: [{ type: String }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Profile', profileSchema);
