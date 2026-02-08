import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fundService, expenseService } from '../services/api';
import { useStore } from '../store/useStore';
import { ArrowLeft, Trash2, Calendar, TrendingDown, Wallet, Plus } from 'lucide-react';
import ExpenseList from '../components/ExpenseList';
import ProgressBar from '../components/ProgressBar';
import toast from 'react-hot-toast';

const FundDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fund, setFund] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchGlobalFunds = useStore((state) => state.fetchFunds);

  const fetchFundDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fundService.getFund(id);
      setFund(response.data);
    } catch (error: any) {
      toast.error('Failed to load fund details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchFundDetails();
  }, [fetchFundDetails]);

  const handleDeleteFund = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this fund? All associated expenses will be lost.')) return;
    
    try {
      await fundService.deleteFund(id);
      toast.success('Fund deleted successfully');
      await fetchGlobalFunds(); // Update global state
      navigate('/');
    } catch (error: any) {
      toast.error('Failed to delete fund');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm('Delete this expense?')) return;
    
    try {
      await expenseService.deleteExpense(expenseId);
      toast.success('Expense deleted');
      fetchFundDetails(); // Refresh details
      fetchGlobalFunds(); // Update global state
    } catch (error: any) {
      toast.error('Failed to delete expense');
    }
  };

  if (loading || !fund) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const usagePercentage = (fund.usedAmount / fund.totalAmount) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>
        <button 
          onClick={handleDeleteFund}
          className="flex items-center space-x-2 text-red-500 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-all self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Fund</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Fund Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm lg:sticky lg:top-24">
            <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2 truncate">{fund.name}</h1>
            <div className="flex items-center text-sm text-slate-500 mb-8">
              <Calendar className="w-4 h-4 mr-1 shrink-0" />
              <span className="truncate">Created on {fund.day ? `${fund.day}, ` : ''}{new Date(fund.date).toLocaleDateString()}</span>
            </div>

            {fund.note && (
              <div className="mb-8 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 italic break-words">
                "{fund.note}"
              </div>
            )}

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-500 uppercase tracking-wider">Remaining Balance</span>
                  <span className="text-primary-600">${fund.remainingAmount.toLocaleString()}</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 truncate">${fund.remainingAmount.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>Usage Progress</span>
                  <span className={usagePercentage > 90 ? 'text-red-500' : ''}>{usagePercentage.toFixed(1)}%</span>
                </div>
                <ProgressBar 
                  progress={usagePercentage} 
                  color={usagePercentage > 90 ? 'bg-red-500' : 'bg-primary-600'} 
                />
              </div>

              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 truncate">Total Fund</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800 truncate">${fund.totalAmount.toLocaleString()}</p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 truncate">Total Spent</p>
                  <p className="text-base sm:text-lg font-bold text-red-600 truncate">${fund.usedAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Expense List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-slate-400" />
              Expense Breakdown
            </h2>
            <button 
              onClick={() => navigate('/add-expense')}
              className="btn-secondary flex items-center space-x-2 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Record New</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm min-h-[400px]">
            <ExpenseList expenses={fund.expenses || []} onDelete={handleDeleteExpense} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetails;
