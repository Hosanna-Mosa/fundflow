import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import FundCard from '../components/FundCard';
import { Plus, TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { funds, fetchFunds, loading, getTotalStats } = useStore();
  const { totalIncome, totalExpense, currentBalance } = getTotalStats();

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  if (loading && funds.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Financial Overview</h1>
          <p className="text-slate-500 mt-1">Track your sources and manage your spending.</p>
        </div>
        <Link to="/add-fund" className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
          <Plus className="w-5 h-5" />
          <span>Add Fund</span>
        </Link>
      </div>
 
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Balance</p>
            <div className="bg-primary-50 p-2.5 rounded-xl">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 truncate">${currentBalance.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <Wallet className="w-3 h-3 mr-1.5" />
            <span>Across all active funds</span>
          </div>
        </div>
 
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Income</p>
            <div className="bg-green-50 p-2.5 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 truncate">${totalIncome.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-[10px] font-bold text-green-600 uppercase tracking-tight">
            <TrendingUp className="w-3 h-3 mr-1.5" />
            <span>Lifetime history</span>
          </div>
        </div>
 
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Expenses</p>
            <div className="bg-red-50 p-2.5 rounded-xl">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 truncate">${totalExpense.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-[10px] font-bold text-red-600 uppercase tracking-tight">
            <TrendingDown className="w-3 h-3 mr-1.5" />
            <span>{totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0}% of total funds</span>
          </div>
        </div>
      </div>

      {/* Funds Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Your Funds</h2>
          <span className="text-sm text-slate-500 font-medium">{funds.length} Active Sources</span>
        </div>
        
        {funds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600">No funds yet</h3>
            <p className="text-slate-400 mb-6">Start by adding your first source of income.</p>
            <Link to="/add-fund" className="btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create First Fund</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funds.map((fund) => (
              <FundCard key={fund._id} fund={fund} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
