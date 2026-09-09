import express from 'express';

import {
  assignTask,
  createTask,
  deleteTask,
  getMyTasks,
  updateTaskStatus
} from '../controllers/taskController.js';
import { checkRole, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(checkRole('ADMIN'), createTask)
  .get(getMyTasks);

router.patch('/:taskId/assign', checkRole('ADMIN'), assignTask);
router.patch('/:taskId/status', updateTaskStatus);
router.delete('/:taskId', checkRole('ADMIN'), deleteTask);

export default router;
