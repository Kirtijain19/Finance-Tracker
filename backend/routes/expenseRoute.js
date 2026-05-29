import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
	addExpense,
	getExpenses,
	updateExpense,
	deleteExpense,
	downloadExpenseExcel,
	getExpenseOverview
} from '../controllers/expenseController.js';
const expenseRouter = express.Router();
expenseRouter.post('/add', authMiddleware, addExpense);
expenseRouter.get('/get', authMiddleware, getExpenses);
expenseRouter.put('/update/:id', authMiddleware, updateExpense);
expenseRouter.delete('/delete/:id', authMiddleware, deleteExpense); 

expenseRouter.get('/download', authMiddleware, downloadExpenseExcel);
expenseRouter.get('/overview', authMiddleware, getExpenseOverview); 

export default expenseRouter;