import expenseModel from '../models/expenseModel.js';
import getDateRange from '../utils/dateFilter.js';
import XLSX from 'xlsx';


// add expense
export const addExpense = async (req, res) => {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;
    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date),
        });

        await newExpense.save();
        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense: newExpense
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error adding expense",
            error: error.message
        });
    }
}


// get all expenses of a user
export async function getExpenses(req, res) {
    const userId = req.user._id;
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        return res.status(200).json({ success: true, expenses });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching expenses",
            error: error.message
        });
    }
}

// update expense
export const updateExpense = async (req, res) => {
    const userId = req.user._id;
    const expenseId = req.params.id;
    const { description, amount, category, date } = req.body;
    try {
        const updatedExpense = await expenseModel.findOneAndUpdate({ _id: expenseId, userId }, { description, amount, category, date }, { new: true });
        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating expense",
            error: error.message
        });
    }
}


// delete expense
export const deleteExpense = async (req, res) => {
    try {
        const expense = await expenseModel.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting expense",

            error: error.message
        });
    }
}

// download excel for expense
export const downloadExpenseExcel = async (req, res) => {
   const userId = req.user._id;
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        const rows = expenses.map((expense) => ({
            Description: expense.description,
            Amount: expense.amount,
            Category: expense.category,
            Date: expense.date.toISOString().split('T')[0]
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", "attachment; filename=expenses.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error downloading expenses",
            error: error.message
        });
    }
}

// to get overview of expanse
export const getExpenseOverview = async (req, res) => {
     try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { startDate, endDate } = getDateRange(range);
        const expenses = await expenseModel
            .find({ userId, date: { $gte: startDate, $lte: endDate } })
            .sort({ date: -1 });

        const totalExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
        const numberOfTransactions = expenses.length;

        const recentTransactions = expenses.slice(0, 5);
        return res.status(200).json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching expense overview",
            error: error.message
        });
    }
}