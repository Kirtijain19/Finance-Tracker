import React, { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChartPie, Filter, Plus, RefreshCcw, Wallet } from "lucide-react";
import axios from "axios";
import Add from "../components/Add";
import Gaugecard from "../components/Gaugecard";
import Timeframe from "../components/Timeframe";
import TransactionItem from "../components/TransactionItem";
import { dashboardStyles, styles } from "../assets/dummyStyles";
import { dummyTransactions, financialOverviewData } from "../assets/dummy";
import { formatCurrency } from "../components/Helpers";

const BASE_URL = "https://finance-tracker-8ig9.onrender.com/api";

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("Monthly");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setDashboardData(null);
          setLoading(false);
          return;
        }
        const response = await axios.get(`${BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(response.data?.data || null);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const recentTransactions = useMemo(() => {
    if (dashboardData?.recentTransactions?.length) {
      return dashboardData.recentTransactions.slice(0, 4);
    }
    return dummyTransactions.slice(0, 4);
  }, [dashboardData]);

  const monthlyIncome = dashboardData?.monthlyIncome ?? 45000;
  const monthlyExpense = dashboardData?.monthlyExpense ?? 15000;
  const savings = dashboardData?.savings ?? monthlyIncome - monthlyExpense;
  const savingsRate = dashboardData?.savingsRate ?? (monthlyIncome ? Math.round((savings / monthlyIncome) * 100) : 0);
  const spendByCategory = dashboardData?.expenseDistribution || financialOverviewData;

  return (
    <div className={dashboardStyles.container}>
      <div className={styles.header.container}>
        <div>
          <h1 className={styles.header.title}>Dashboard</h1>
          <p className={styles.header.subtitle}>Welcome back</p>
        </div>
        <button className={dashboardStyles.addButton} onClick={() => setIsAddOpen(true)}>
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      <div className={dashboardStyles.summaryGrid}>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Balance</span>
            <span className={dashboardStyles.walletIconContainer}>
              <Wallet size={16} className="text-teal-600" />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(savings)}</p>
          <span className={dashboardStyles.balanceBadge}>${savings} this month</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Monthly Income</span>
            <span className={dashboardStyles.iconContainer("bg-teal-100")}> 
              <ArrowUpRight size={16} className="text-teal-600" />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(monthlyIncome)}</p>
          <span className="text-xs text-teal-600">+12% from last month</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Monthly Expenses</span>
            <span className={dashboardStyles.arrowDownIconContainer}>
              <ArrowDownRight size={16} className="text-orange-600" />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(monthlyExpense)}</p>
          <span className="text-xs text-orange-600">0% from last month</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Savings Rate</span>
            <span className={dashboardStyles.piggyBankIconContainer}>
              <ChartPie size={16} className="text-cyan-600" />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{savingsRate}%</p>
          <span className="text-xs text-gray-500">Needs improvement</span>
        </div>
      </div>

      <div className={styles.grid.main}>
        <div className={styles.grid.leftColumn}>
          <div className={styles.cards.base}>
            <div className={dashboardStyles.listHeader}>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Financial Overview</h2>
                <p className="text-xs text-gray-500">{timeframe} view</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-xs text-gray-500">
                  <Filter size={14} /> Filters
                </button>
                <Timeframe value={timeframe} onChange={setTimeframe} />
              </div>
            </div>

            <div className="bg-teal-50 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-semibold text-teal-700">Finance Dashboard</h3>
                <p className="text-sm text-teal-600 mt-1">Track your income and expenses</p>
              </div>
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md">
                Add Transaction
              </button>
            </div>

            <div className={dashboardStyles.gaugeGrid}>
              {[
                { name: "Income", value: monthlyIncome, percent: 100, color: "#14b8a6" },
                { name: "Expenses", value: monthlyExpense, percent: Math.round((monthlyExpense / (monthlyIncome || 1)) * 100), color: "#f97316" },
                { name: "Savings", value: savings, percent: savingsRate, color: "#0ea5e9" }
              ].map((item) => (
                <Gaugecard
                  key={item.name}
                  title={item.name}
                  value={item.value}
                  percent={item.percent}
                  color={item.color}
                  icon={item.name === "Expenses" ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.grid.rightColumn}>
          <div className={styles.cards.base}>
            <div className={styles.transactions.cardHeader}>
              <h3 className={styles.transactions.cardTitle}>Recent Transactions</h3>
              <button className={styles.transactions.refreshButton}>
                <RefreshCcw className={styles.transactions.refreshIcon(false)} />
              </button>
            </div>
            <div className={styles.transactions.dataStackingInfo}>
              <span className={styles.transactions.dataStackingIcon}>i</span>
              Transactions are stacked by date (newest first)
            </div>
            <div className={styles.transactions.listContainer}>
              {loading ? (
                <div className={styles.transactions.emptyState}>
                  <p className={styles.transactions.emptyText}>Loading...</p>
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className={styles.transactions.emptyState}>
                  <div className={styles.transactions.emptyIconContainer}>!</div>
                  <p className={styles.transactions.emptyText}>No recent transactions</p>
                </div>
              ) : (
                recentTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id || transaction._id} transaction={transaction} />
                ))
              )}
            </div>
          </div>

          <div className={styles.cards.base}>
            <h3 className={styles.categories.title}>Spending by Category</h3>
            <div className={styles.categories.list}>
              {spendByCategory.slice(0, 4).map((item) => (
                <div key={item.name} className={styles.categories.categoryItem}>
                  <div className="flex items-center gap-3">
                    <div className={styles.categories.categoryIconContainer}>
                      <ChartPie className={styles.categories.categoryIcon} />
                    </div>
                    <span className={styles.categories.categoryName}>{item.name || item.category}</span>
                  </div>
                  <span className={styles.categories.categoryAmount}>{formatCurrency(item.value || item.amount)}</span>
                </div>
              ))}
            </div>
            <div className={styles.categories.summaryContainer}>
              <div className={styles.categories.summaryGrid}>
                <div className={styles.categories.summaryIncomeCard}>
                  <p className={styles.categories.summaryTitle}>Total Income</p>
                  <p className={styles.categories.summaryValue}>{formatCurrency(monthlyIncome)}</p>
                </div>
                <div className={styles.categories.summaryExpenseCard}>
                  <p className={styles.categories.summaryTitle}>Total Expenses</p>
                  <p className={styles.categories.summaryValue}>{formatCurrency(monthlyExpense)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Add
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={() => setIsAddOpen(false)}
        type="income"
      />
    </div>
  );
};

export default Dashboard;

