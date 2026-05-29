import React from "react";

const Support = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Support — How to use Finance Tracker</h1>

      <section className="mb-4">
        <h2 className="font-semibold">Overview</h2>
        <p className="text-sm text-gray-600">Finance Tracker helps you record incomes and expenses, view trends, and manage your personal finances.</p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">Adding Transactions</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700">
          <li>Click the <strong>+ Add</strong> button on the Dashboard or the Income/Expenses page.</li>
          <li>Choose the type (Income or Expense), enter a description, amount, category and date.</li>
          <li>Click <strong>Save</strong> to add the transaction. If you are logged in, the entry is saved to your account and persists after reload.</li>
        </ol>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">Editing & Deleting</h2>
        <p className="text-sm text-gray-700">Use the edit and delete icons next to each transaction to modify or remove it. Changes are persisted when you are logged in.</p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">Filtering & Timeframes</h2>
        <p className="text-sm text-gray-700">On the Income and Expenses pages you can filter by category and date range to focus on specific transactions.</p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-700">The Dashboard summarizes monthly income, expenses, savings and recent transactions. Log in to see your personal data.</p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">Account</h2>
        <p className="text-sm text-gray-700">Use the Profile page to view or update your name and email. For security, change your password from the backend API or account settings.</p>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">Troubleshooting</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
          <li>If transactions disappear after reload, make sure you are logged in so data is persisted to the server.</li>
          <li>If charts or gauges don't show, check that the backend server is running at <code>http://localhost:4000/api</code> and you have a valid token stored in localStorage.</li>
          <li>For any errors, open the browser console to see details and contact support.</li>
        </ul>
      </section>

      <p className="text-xs text-gray-500">If you still need help, contact the project owner or open an issue in the repository.</p>
    </div>
  );
};

export default Support;
