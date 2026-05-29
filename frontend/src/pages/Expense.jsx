import React, { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, Download, Plus } from "lucide-react";
import axios from "axios";
import Add from "../components/Add";
import TransactionItem from "../components/TransactionItem";
import Timeframe from "../components/Timeframe";
import { expensePageStyles } from "../assets/dummyStyles";
import { dummyTransactions } from "../assets/dummy";
import { formatCurrency } from "../components/Helpers";

const BASE_URL = "https://finance-tracker-8ig9.onrender.com/api";
const Expense = () => {
  const [timeframe, setTimeframe] = useState("Monthly");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const averageExpense = expenses.length ? totalExpense / expenses.length : 0;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setExpenses(dummyTransactions.filter((item) => item.type === "expense"));
          setLoading(false);
          return;
        }
        const response = await axios.get(`${BASE_URL}/expenses/get`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(response.data?.expenses || []);
      } catch (error) {
        console.error("Error loading expenses:", error);
        setExpenses(dummyTransactions.filter((item) => item.type === "expense"));
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const chartData = useMemo(() => {
    if (expenses.length === 0) return [];
    const recent = expenses.slice(0, 7).reverse();
    const max = Math.max(...recent.map((item) => Number(item.amount || 0)), 1);
    return recent.map((item, index) => {
      const date = item.date ? new Date(item.date) : null;
      const label = date && !Number.isNaN(date.getTime()) ? date.getDate() : `D${index + 1}`;
      const value = Number(item.amount || 0);
      return {
        label,
        value,
        height: Math.max(8, Math.round((value / max) * 100))
      };
    });
  }, [expenses]);

  const handleAddExpense = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const newExpense = {
          id: `exp-${Date.now()}`,
          type: "expense",
          description: payload.description,
          amount: payload.amount,
          category: payload.category,
          date: payload.date || new Date().toISOString(),
        };
        setExpenses((prev) => [newExpense, ...prev]);
        setIsAddOpen(false);
        return;
      }
      if (editingExpense) {
        const response = await axios.put(
          `${BASE_URL}/expenses/update/${editingExpense._id || editingExpense.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = response.data?.expense;
        if (updated) {
          setExpenses((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
        }
        setEditingExpense(null);
      } else {
        const response = await axios.post(
          `${BASE_URL}/expenses/add`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const created = response.data?.expense;
        if (created) {
          setExpenses((prev) => [created, ...prev]);
        }
      }
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleEditExpense = (item) => {
    setEditingExpense(item);
    setIsAddOpen(true);
  };

  const handleDeleteExpense = async (item) => {
    const confirmDelete = window.confirm("Delete this expense?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setExpenses((prev) => prev.filter((exp) => exp.id !== item.id));
        return;
      }
      await axios.delete(`${BASE_URL}/expenses/delete/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses((prev) => prev.filter((exp) => exp._id !== item._id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className={expensePageStyles.container}>
      <div className={expensePageStyles.headerCard}>
        <div className={expensePageStyles.headerContainer}>
          <div>
            <h1 className={expensePageStyles.headerTitle}>Expenses</h1>
            <p className={expensePageStyles.headerSubtitle}>Monitor your spending habits</p>
          </div>
          <button
            className={expensePageStyles.addButton}
            onClick={() => {
              setEditingExpense(null);
              setIsAddOpen(true);
            }}
          >
            <Plus size={18} /> Add Expense
          </button>
        </div>

        <div className={expensePageStyles.cardsGrid}>
          <div className={`bg-white rounded-xl p-4 shadow-sm border ${expensePageStyles.borderOrange}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Expenses</span>
              <span className={expensePageStyles.iconOrange}>
                <ArrowDownRight size={16} className={expensePageStyles.textOrange} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(totalExpense)}</p>
            <span className="text-xs text-gray-500">This month</span>
          </div>
          <div className={`bg-white rounded-xl p-4 shadow-sm border ${expensePageStyles.borderAmber}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Average Expense</span>
              <span className={expensePageStyles.iconAmber}>
                <ArrowDownRight size={16} className={expensePageStyles.textAmber} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(averageExpense)}</p>
            <span className="text-xs text-gray-500">All transactions</span>
          </div>
          <div className={`bg-white rounded-xl p-4 shadow-sm border ${expensePageStyles.borderYellow}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Transactions</span>
              <span className={expensePageStyles.iconYellow}>
                <ArrowDownRight size={16} className={expensePageStyles.textYellow} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{expenses.length}</p>
            <span className="text-xs text-gray-500">All records</span>
          </div>
        </div>
      </div>

      <div className={expensePageStyles.chartContainer}>
        <div className={expensePageStyles.chartHeader}>
          <div>
            <h2 className={expensePageStyles.chartTitle}>Daily Expense Trends</h2>
            <p className="text-xs text-gray-500">{timeframe} view</p>
          </div>
          <div className="flex items-center gap-3">
            <Timeframe value={timeframe} onChange={setTimeframe} />
            <button className={expensePageStyles.chartExportButton}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>
        <div className={`${expensePageStyles.chartHeight} bg-linear-to-br from-orange-50 to-amber-50 rounded-xl`}>
          {loading ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading...</div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">No data yet</div>
          ) : (
            <div className="h-full px-6 pb-6 pt-4 flex items-end gap-3">
              {chartData.map((bar) => (
                <div
                  key={bar.label}
                  className="flex-1 h-full flex flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-orange-500 to-amber-400"
                    style={{ height: `${bar.height}%` }}
                    title={`$${bar.value}`}
                  />
                  <span className="text-xs text-gray-500">{bar.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={expensePageStyles.transactionsContainer}>
        <div className={expensePageStyles.transactionsHeader}>
          <div>
            <h2 className={expensePageStyles.transactionsTitle}>Expense Transactions</h2>
            <p className="text-xs text-gray-500">This month</p>
          </div>
          <div className="flex items-center gap-3">
            <select className={expensePageStyles.filterSelect}>
              <option>All Transactions</option>
              <option>Housing</option>
              <option>Food</option>
            </select>
            <button className={expensePageStyles.exportButton}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className={expensePageStyles.transactionsList}>
          {expenses.length === 0 ? (
            <div className={expensePageStyles.emptyState}>
              <div className={expensePageStyles.emptyStateIcon}>$</div>
              <p className={expensePageStyles.emptyStateText}>No expense transactions</p>
              <p className={expensePageStyles.emptyStateSubtext}>Add your first expense to get started.</p>
              <button
                className={expensePageStyles.viewAllButton}
                onClick={() => {
                  setEditingExpense(null);
                  setIsAddOpen(true);
                }}
              >
                <Plus size={16} /> Add Expense
              </button>
            </div>
          ) : (
            expenses.slice(0, 6).map((item) => (
              <TransactionItem
                key={item._id || item.id}
                transaction={item}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            ))
          )}
        </div>
      </div>

      <Add
        isOpen={isAddOpen}
        type="expense"
        onClose={() => {
          setEditingExpense(null);
          setIsAddOpen(false);
        }}
        onSubmit={handleAddExpense}
        initialValues={editingExpense}
        submitLabel={editingExpense ? "Update Expense" : "Add Expense"}
      />
    </div>
  );
};

export default Expense;
