import express from 'express';
import { getRoutine, updateRoutine } from '../controllers/routine.controller.js';
const router = express.Router();

router.get('/', getRoutine);
router.put('/', updateRoutine);

export default router;
