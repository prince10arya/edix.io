import { Router } from 'express';
import { signup, login, getMe, signupValidation, loginValidation } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

export default router;
