import express from 'express';

import {
  addProjectMember,
  createProject,
  getAvailableProjectUsers,
  getMyProjects
} from '../controllers/projectController.js';
import { checkRole, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(checkRole('ADMIN'), createProject)
  .get(getMyProjects);

router.get('/:projectId/available-users', getAvailableProjectUsers);
router.post('/:projectId/members', addProjectMember);
router.post('/:projectId/add-member', addProjectMember);

export default router;
