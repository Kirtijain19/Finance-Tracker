# Finance Tracker

A full-stack expense tracker with income/expense management, dashboard analytics, and profile management.

## Project Setup

### Prerequisites
- Node.js 18+
- npm
- MongoDB (local or Atlas)

### Backend
1. Open a terminal in `backend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   The API runs on `http://localhost:4000`.

### Frontend
1. Open a terminal in `frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:5173`.

## Features Implemented
- User authentication (register, login)
- Dashboard with summary cards and recent transactions
- Income management (add, edit, delete, list)
- Expense management (add, edit, delete, list)
- Trend charts for income and expenses
- Profile view and update
- Export endpoints for income/expense data
- transactions categorization
- view spending summary
- filter transactions by category and date

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Axios, Lucide Icons, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Tooling: ESLint
