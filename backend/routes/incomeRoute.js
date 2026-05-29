import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
	addIncome,
	getIncomes,
	updateIncome,
	deleteIncome,
	downloadIncomes,
	getIncomeOverview
} from '../controllers/incomeController.js';

const incomeRouter = express.Router();
incomeRouter.post('/add', authMiddleware, addIncome);
incomeRouter.get('/get', authMiddleware, getIncomes);
incomeRouter.put('/update/:id', authMiddleware, updateIncome);
incomeRouter.get('/download', authMiddleware, downloadIncomes);
incomeRouter.delete('/delete/:id', authMiddleware, deleteIncome);
incomeRouter.get('/overview', authMiddleware, getIncomeOverview); 

export default incomeRouter;