import express from 'express';
import { body } from 'express-validator';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentController.js';

const router = express.Router();

const assignmentValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('courseCode').trim().notEmpty().withMessage('Course code is required'),
  body('dueDate').isISO8601().withMessage('A valid due date is required')
];

router.get('/', getAssignments);
router.post('/', assignmentValidation, createAssignment);
router.patch('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
