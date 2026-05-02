import express from 'express';
import { registerUser, loginUser, guestLogin, googleLogin, getProfile, updateProfile, upgradeUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/guest', guestLogin);
router.post('/google', googleLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('image'), updateProfile);
router.put('/upgrade', protect, upgradeUser);

export default router;
