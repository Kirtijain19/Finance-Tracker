import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, Download, Plus } from "lucide-react";
import axios from "axios";
import Add from "../components/Add";
import Timeframe from "../components/Timeframe";
import TransactionItem from "../components/TransactionItem";
import { incomeStyles } from "../assets/dummyStyles";
import { dummyTransactions } from "../assets/dummy";
import { formatCurrency } from "../components/Helpers";

const BASE_URL = "http://localhost:4000/api";

const Income = () => {
  const [timeframe, setTimeframe] = useState("Monthly");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const averageIncome = incomes.length ? totalIncome / incomes.length : 0;

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIncomes(dummyTransactions.filter((item) => item.type === "income"));
          setLoading(false);
          return;
        }
        const response = await axios.get(`${BASE_URL}/incomes/get`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIncomes(response.data?.incomes || []);
      } catch (error) {
        console.error("Error loading incomes:", error);
        setIncomes(dummyTransactions.filter((item) => item.type === "income"));
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  const chartData = useMemo(() => {
    if (incomes.length === 0) return [];
    const recent = incomes.slice(0, 7).reverse();
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
  }, [incomes]);

  const handleAddIncome = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const newIncome = {
          id: `inc-${Date.now()}`,
          type: "income",
          description: payload.description,
          amount: payload.amount,
          category: payload.category,
          date: payload.date || new Date().toISOString(),
        };
        setIncomes((prev) => [newIncome, ...prev]);
        setIsAddOpen(false);
        return;
      }

      if (editingIncome) {
        const response = await axios.put(
          `${BASE_URL}/incomes/update/${editingIncome._id || editingIncome.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = response.data?.income;
        if (updated) {
          setIncomes((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
        }
        setEditingIncome(null);
      } else {
        const response = await axios.post(
          `${BASE_URL}/incomes/add`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const created = response.data?.income;
        if (created) {
          setIncomes((prev) => [created, ...prev]);
        }
      }
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  const handleEditIncome = (item) => {
    setEditingIncome(item);
    setIsAddOpen(true);
  };

  const handleDeleteIncome = async (item) => {
    const confirmDelete = window.confirm("Delete this income?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIncomes((prev) => prev.filter((inc) => inc.id !== item.id));
        return;
      }
      await axios.delete(`${BASE_URL}/incomes/delete/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncomes((prev) => prev.filter((inc) => inc._id !== item._id));
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  return (
    <div className={incomeStyles.wrapper}>
      <div className={incomeStyles.headerContainer}>
        <div className={incomeStyles.header}>
          <div>
            <h1 className={incomeStyles.headerTitle}>Income</h1>
            <p className={incomeStyles.headerSubtitle}>Track your monthly earnings</p>
          </div>
          <button
            className={incomeStyles.addButton}
            onClick={() => {
              setEditingIncome(null);
              setIsAddOpen(true);
            }}
          >
            <Plus size={18} /> Add Income
          </button>
        </div>

        <div className={incomeStyles.summaryGrid}>
          <div className={`bg-white rounded-xl p-4 shadow-sm border ${incomeStyles.borderGreen}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Income</span>
              <span className={incomeStyles.iconGreen}>
                <ArrowUpRight size={16} className={incomeStyles.textGreen} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(totalIncome)}</p>
            <span className="text-xs text-gray-500">This month</span>
          </div>
          <div className={`bg-white rounded-xl p-4 shadow-sm border ${incomeStyles.borderBlue}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Average Income</span>
              <span className={incomeStyles.iconBlue}>
                <BarChart3 size={16} className={incomeStyles.textBlue} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(averageIncome)}</p>
            <span className="text-xs text-gray-500">All transactions</span>
          </div>
          <div className={`bg-white rounded-xl p-4 shadow-sm border ${incomeStyles.borderPurple}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Transactions</span>
              <span className={incomeStyles.iconPurple}>
                <BarChart3 size={16} className={incomeStyles.textPurple} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{incomes.length}</p>
            <span className="text-xs text-gray-500">All records</span>
          </div>
        </div>
      </div>

      <div className={incomeStyles.chartContainer}>
        <div className={incomeStyles.chartHeaderContainer}>
          <div>
            <h2 className={incomeStyles.chartTitle}>Daily Income Trends</h2>
            <p className="text-xs text-gray-500">{timeframe} view</p>
          </div>
          <div className="flex items-center gap-3">
            <Timeframe value={timeframe} onChange={setTimeframe} />
            <button className={incomeStyles.exportButton}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>
        <div className={`${incomeStyles.chartHeight} bg-linear-to-br from-green-50 to-emerald-50 rounded-xl`}>
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
                    className="w-full rounded-lg bg-gradient-to-t from-emerald-500 to-green-400"
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

      <div className={incomeStyles.listContainer}>
        <div className={incomeStyles.chartHeaderContainer}>
          <div>
            <h2 className={incomeStyles.sectionTitle}>Income Transactions</h2>
            <p className="text-xs text-gray-500">This month</p>
          </div>
          <div className={incomeStyles.filterContainer}>
            <select className={incomeStyles.filterSelect}>
              <option>All Transactions</option>
              <option>Salary</option>
              <option>Investment</option>
            </select>
            <button className={incomeStyles.exportButton}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className={incomeStyles.transactionList}>
          {incomes.length === 0 ? (
            <div className={incomeStyles.emptyStateContainer}>
              <div className={incomeStyles.emptyStateIcon}>$</div>
              <p className={incomeStyles.emptyStateText}>No income transactions</p>
              <p className={incomeStyles.emptyStateSubtext}>Add your first income to get started.</p>
              <button
                className={incomeStyles.emptyStateButton}
                onClick={() => {
                  setEditingIncome(null);
                  setIsAddOpen(true);
                }}
              >
                <Plus size={16} /> Add Income
              </button>
            </div>
          ) : (
            incomes.slice(0, 6).map((item) => (
              <TransactionItem
                key={item._id || item.id}
                transaction={item}
                onEdit={handleEditIncome}
                onDelete={handleDeleteIncome}
              />
            ))
          )}
        </div>
      </div>

      <Add
        isOpen={isAddOpen}
        type="income"
        onClose={() => {
          setEditingIncome(null);
          setIsAddOpen(false);
        }}
        onSubmit={handleAddIncome}
        initialValues={editingIncome}
        submitLabel={editingIncome ? "Update Income" : "Add Income"}
      />
    </div>
  );
};

export default Income;
