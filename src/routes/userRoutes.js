import express from 'express';

import { getUsers } from '../controllers/userController.js';
import { checkRole, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, checkRole('ADMIN'), getUsers);

export default router;
