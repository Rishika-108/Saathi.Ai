import express from 'express'
import { registerUser, loginUser, getProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js'
import { getUserTrajectory } from '../controllers/dashboardController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser)
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.get('/trajectory', authMiddleware, getUserTrajectory);
export default userRouter;