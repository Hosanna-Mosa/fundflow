# FundFlow – Source-Based Expense Tracker

FundFlow is a full-stack financial management tool that helps you track income as "funds" and link expenses to specific sources. This "envelope budgeting" approach gives you a clear picture of how much of each income source is remaining.

## Features

- **Fund Management**: Create funds (income sources) with specific amounts.
- **Expense Tracking**: Deduct expenses from specific funds to track lineage.
- **Visual Dashboard**: Premium UI with progress bars showing fund usage.
- **Real-time Balance**: Automatic calculation of remaining balances.
- **Strict Budgeting**: Warning/Prevention when an expense exceeds a fund's balance.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Zustand, Axios, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), REST API.

## Project Structure

```text
/
├── backend/            # Express API
│   ├── controllers/    # Route controllers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── services/       # Middleware and utilities
│   └── server.js       # Entry point
└── frontend/           # React App
    ├── src/
    │   ├── components/ # Reusable UI
    │   ├── pages/      # View components
    │   ├── services/   # API communication
    │   └── store/      # Global state (Zustand)
    └── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (running locally or a cloud URI)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/fundflow
   NODE_ENV=development
   ```
4. Seed the database with sample data (optional but recommended):
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Funds
- `GET /api/funds` - Get all funds
- `GET /api/funds/:id` - Get fund details and its expenses
- `POST /api/funds` - Create a new fund
- `DELETE /api/funds/:id` - Delete a fund (and its expenses)

### Expenses
- `POST /api/expenses` - Create a new expense (updates fund balance)
- `GET /api/expenses/fund/:fundId` - Get expenses for a specific fund
- `DELETE /api/expenses/:id` - Delete an expense (reverses fund balance)
