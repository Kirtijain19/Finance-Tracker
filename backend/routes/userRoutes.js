import express from 'express';
import {
	registerUser,
	loginUser,
	getUserProfile,
	updateUserProfile,
	updateUserPassword
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// protected route to get user profile
userRouter.get('/me', authMiddleware, getUserProfile);
userRouter.put('/profile', authMiddleware, updateUserProfile);
userRouter.put('/password', authMiddleware, updateUserPassword);

export default userRouter;
