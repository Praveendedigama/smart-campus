import Assignment from '../models/Assignment.js';
import { validationResult } from 'express-validator';

export const getAssignments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const assignments = await Assignment.find(query).sort({ dueDate: 1 });
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const createAssignment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    next(err);
  }
};
