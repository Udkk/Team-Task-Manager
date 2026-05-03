import express from 'express';

import { login, signup } from '../controllers/authController.js';
import {
  validateLogin,
  validateSignup
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

export default router;
