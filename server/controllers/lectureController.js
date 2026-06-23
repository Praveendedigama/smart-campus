import Lecture from '../models/Lecture.js';

export const getAllLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find().sort({ dayOfWeek: 1, startTime: 1 });
    res.json(lectures);
  } catch (err) {
    next(err);
  }
};

export const getTodaysLectures = async (req, res, next) => {
  try {
    const today = new Date().getDay();
    const lectures = await Lecture.find({ dayOfWeek: today }).sort({ startTime: 1 });
    res.json(lectures);
  } catch (err) {
    next(err);
  }
};

export const createLecture = async (req, res, next) => {
  try {
    const lecture = new Lecture(req.body);
    await lecture.save();
    res.status(201).json(lecture);
  } catch (err) {
    next(err);
  }
};
