import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import authMiddleware from '../middlewares/auth.js';

const dashboardRouter = express.Router();
dashboardRouter.get('/', authMiddleware, getDashboardData);
export default dashboardRouter;