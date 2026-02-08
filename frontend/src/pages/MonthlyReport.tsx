import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { reportService } from '../services/api';
import { Calendar, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Wallet, Receipt, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import ProgressBar from '../components/ProgressBar';

interface Fund {
  _id: string;
  name: string;
  totalAmount: number;
  usedAmount: number;
  remainingAmount: number;
  date: string;
  day: string;
  note?: string;
}

interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  day: string;
  note?: string;
}

const MonthlyReport: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState<{ funds: Fund[]; expenses: Expense[] }>({ funds: [], expenses: [] });
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const response = await reportService.getMonthlyReport(year, month);
      setData(response.data);
    } catch (error: any) {
      toast.error('Failed to load monthly report');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + offset, 1);
    setDate(newDate);
  };

  const selectMonth = (m: number) => {
    setDate(new Date(date.getFullYear(), m, 1));
    setShowPicker(false);
  };

  const changeYear = (offset: number) => {
    setDate(new Date(date.getFullYear() + offset, date.getMonth(), 1));
  };

  const totalFunds = data.funds.reduce((acc: number, f: Fund) => acc + f.totalAmount, 0);
  const totalExpenses = data.expenses.reduce((acc: number, e: Expense) => acc + e.amount, 0);
  const remaining = totalFunds - totalExpenses;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Monthly Report</h1>
          <p className="text-slate-500 mt-1">View your financial activity for a specific month.</p>
        </div>

        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm relative w-full lg:w-auto">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 hover:text-primary-600 flex-none"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="relative flex-grow lg:flex-none">
            <button 
              onClick={() => setShowPicker(!showPicker)}
              className={`flex items-center justify-center space-x-2 px-6 py-2 rounded-xl transition-all w-full min-w-[200px] ${
                showPicker ? 'bg-primary-50 text-primary-600' : 'hover:bg-slate-50 text-slate-800'
              }`}
            >
              <Calendar className="w-5 h-5 flex-none" />
              <span className="font-bold truncate">{monthName} {year}</span>
            </button>

            {showPicker && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowPicker(false)}
                />
                <div className="absolute top-full right-0 lg:right-auto lg:left-0 mt-2 w-full sm:w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 z-30 p-5 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                    <button onClick={() => changeYear(-1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary-600">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold text-slate-800">{year}</span>
                    <button onClick={() => changeYear(1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary-600">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {months.map((m, idx) => (
                      <button
                        key={m}
                        onClick={() => selectMonth(idx)}
                        className={`py-3 rounded-2xl text-sm font-semibold transition-all ${
                          date.getMonth() === idx 
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                          : 'hover:bg-primary-50 text-slate-600 hover:text-primary-600'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 hover:text-primary-600 flex-none"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm font-bold">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month Income</p>
            <div className="bg-green-50 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 truncate">${totalFunds.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm font-bold">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month Expenses</p>
            <div className="bg-red-50 p-2 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 truncate">${totalExpenses.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm font-bold sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Closing Balance</p>
            <div className="bg-primary-50 p-2 rounded-lg">
              <Wallet className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 truncate">${remaining.toLocaleString()}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Funds List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Funds Received
              </h2>
              <span className="text-sm font-medium text-slate-400">{data.funds.length} items</span>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              {data.funds.length === 0 ? (
                <p className="text-center py-10 text-slate-400">No funds recorded for this month.</p>
              ) : (
                data.funds.map((fund) => (
                  <button 
                    key={fund._id} 
                    onClick={() => navigate(`/funds/${fund._id}`)}
                    className="w-full text-left p-4 bg-slate-50 rounded-2xl space-y-3 hover:bg-primary-50 hover:border-primary-100 border border-transparent transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-800 group-hover:text-primary-700">{fund.name}</h4>
                          <ArrowRight className="w-3 h-3 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-slate-500">{fund.day}, {new Date(fund.date).toLocaleDateString()}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">+${fund.totalAmount.toLocaleString()}</span>
                    </div>
                    {fund.usedAmount > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 group-hover:text-primary-400">
                          <span>Usage</span>
                          <span>{((fund.usedAmount / fund.totalAmount) * 100).toFixed(0)}%</span>
                        </div>
                        <ProgressBar progress={(fund.usedAmount / fund.totalAmount) * 100} color="bg-primary-600" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Expenses List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
                Expenses Recorded
              </h2>
              <span className="text-sm font-medium text-slate-400">{data.expenses.length} items</span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              {data.expenses.length === 0 ? (
                <p className="text-center py-10 text-slate-400">No expenses recorded for this month.</p>
              ) : (
                data.expenses.map((expense) => (
                  <div key={expense._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-xl shadow-sm">
                        <Receipt className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{expense.category}</h4>
                        <p className="text-[10px] text-slate-500">{expense.day}, {new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-slate-900">-${expense.amount.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;
