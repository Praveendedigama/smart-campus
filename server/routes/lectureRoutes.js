import express from 'express';
import { getAllLectures, getTodaysLectures, createLecture } from '../controllers/lectureController.js';

const router = express.Router();

router.get('/', getAllLectures);
router.get('/today', getTodaysLectures);
router.post('/', createLecture);

export default router;
