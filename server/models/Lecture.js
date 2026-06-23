import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  lecturer: { type: String, required: true },
  credits: { type: Number, default: 3 }
});

export default mongoose.model('Lecture', lectureSchema);
