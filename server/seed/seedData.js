import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lecture from '../models/Lecture.js';
import Assignment from '../models/Assignment.js';
import Profile from '../models/Profile.js';

dotenv.config();

const today = new Date().getDay();
const tomorrow = (today + 1) % 7;
const now = new Date();

const lectures = [
  {
    courseCode: 'SENG 41293',
    courseName: 'Mobile Web App Development',
    dayOfWeek: today,
    startTime: '08:00',
    endTime: '10:00',
    location: 'Lab 3 — B Block',
    lecturer: 'Dr. A. Perera',
    credits: 3
  },
  {
    courseCode: 'SENG 41201',
    courseName: 'Software Architecture',
    dayOfWeek: today,
    startTime: '11:00',
    endTime: '13:00',
    location: 'Lecture Hall 2',
    lecturer: 'Dr. K. Fernando',
    credits: 3
  },
  {
    courseCode: 'SENG 41285',
    courseName: 'Machine Learning',
    dayOfWeek: today,
    startTime: '14:00',
    endTime: '16:00',
    location: 'Lab 5 — A Block',
    lecturer: 'Dr. S. Silva',
    credits: 3
  },
  {
    courseCode: 'SENG 41210',
    courseName: 'Cloud Computing',
    dayOfWeek: tomorrow,
    startTime: '09:00',
    endTime: '11:00',
    location: 'Lecture Hall 1',
    lecturer: 'Mr. R. Jayasinghe',
    credits: 3
  }
];

const assignments = [
  {
    title: 'Mobile App Project Submission',
    courseCode: 'SENG 41293',
    description: 'Submit the complete mobile web application with README and source code.',
    dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    priority: 'high',
    status: 'pending'
  },
  {
    title: 'Architecture Diagram',
    courseCode: 'SENG 41201',
    description: 'Draw a complete software architecture diagram for the given case study.',
    dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    status: 'pending'
  },
  {
    title: 'ML Model Comparative Report',
    courseCode: 'SENG 41285',
    description: 'Write a comparative report on classification algorithms.',
    dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    priority: 'high',
    status: 'pending'
  },
  {
    title: 'Cloud Deployment Lab',
    courseCode: 'SENG 41210',
    description: 'Deploy the given application to AWS and document the steps.',
    dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    priority: 'low',
    status: 'completed'
  }
];

const profile = {
  studentName: 'Maneesha Praveen',
  studentId: 'SE_2021_001',
  email: 'mailtopraveenhansa@gmail.com',
  totalCreditsRequired: 120,
  completedCredits: 87,
  enrolledCourses: ['SENG 41293', 'SENG 41201', 'SENG 41285', 'SENG 41210']
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Lecture.deleteMany();
    await Assignment.deleteMany();
    await Profile.deleteMany();
    await Lecture.insertMany(lectures);
    await Assignment.insertMany(assignments);
    await Profile.create(profile);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
