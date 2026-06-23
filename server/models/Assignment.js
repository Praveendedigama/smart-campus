import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  courseCode: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Assignment', assignmentSchema);
