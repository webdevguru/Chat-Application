import express from 'express';
import { allUsers, authUser, registerUser, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', authUser);

// ✅ This line fixes the error you're getting
router.get('/search', allUsers);

router.put('/profile', protect, updateProfile);

export default router;
