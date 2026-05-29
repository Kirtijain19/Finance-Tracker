import incomeModel from '../models/incomeModel.js';
import XLSX from 'xlsx';
import getDateRange from '../utils/dateFilter.js';

// add income
export const addIncome = async (req, res) => {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;
    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date),
        });

        await newIncome.save();
        return res.status(201).json({
            success: true,
            message: "Income added successfully",
            income: newIncome
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error adding income",
            error: error.message
        });
    }
}

// get all income of a user
export const getIncomes = async (req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        return res.status(200).json({ success: true, incomes });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching incomes",
            error: error.message
        });
    }

}

// update income
export const updateIncome = async (req, res) => {
    const userId = req.user._id;
    const incomeId = req.params.id;
    const { description, amount, category, date } = req.body;
    try {
        const updatedIncome = await incomeModel.findOneAndUpdate({ _id: incomeId, userId }, { description, amount, category, date }, { new: true });
        if (!updatedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Income updated successfully",
            income: updatedIncome
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating income",
            error: error.message
        });
    }
}

// to delete income
export const deleteIncome = async (req, res) => {
    try {
        const income = await incomeModel.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Income deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting income",

            error: error.message
        });
    }
}


// to download data in excel sheet

export const downloadIncomes = async (req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        const rows = incomes.map((income) => ({
            Description: income.description,
            Amount: income.amount,
            Category: income.category,
            Date: income.date.toISOString().split('T')[0]
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", "attachment; filename=incomes.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error downloading incomes",
            error: error.message
        });
    }
}


// to get income overview
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { startDate, endDate } = getDateRange(range);
        const incomes = await incomeModel.find({ userId, date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 });

        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;

        const recentTransactions = incomes.slice(0, 9);
        return res.status(200).json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching income overview",
            error: error.message
        });
    }
}