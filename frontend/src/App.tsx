import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AddFund from './pages/AddFund';
import AddExpense from './pages/AddExpense';
import FundDetails from './pages/FundDetails';
import MonthlyReport from './pages/MonthlyReport';
import EditExpense from './pages/EditExpense';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-fund" element={<AddFund />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/edit-expense/:id" element={<EditExpense />} />
            <Route path="/funds/:id" element={<FundDetails />} />
            <Route path="/monthly-report" element={<MonthlyReport />} />
          </Routes>
        </main>

        <footer className="py-8 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} FundFlow – Source-Based Expense Tracker
            </p>
          </div>
        </footer>

        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;
