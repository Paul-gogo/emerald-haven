import express from 'express';
import {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../../controllers/authControllers.js';
import { protect } from '../../middleware/project.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword); // ✅ Protected now

export default router;

