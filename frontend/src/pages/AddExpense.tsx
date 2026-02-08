import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService, fundService } from '../services/api';
import { useStore } from '../store/useStore';
import { ArrowLeft, Receipt, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AddExpense: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    fundId: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { funds, fetchFunds } = useStore();

  useEffect(() => {
    if (funds.length === 0) {
      fetchFunds();
    }
  }, [funds.length, fetchFunds]);

  const selectedFund = funds.find(f => f._id === formData.fundId);
  const isOverspending = selectedFund && Number(formData.amount) > selectedFund.remainingAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.fundId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await expenseService.addExpense({
        ...formData,
        amount: Number(formData.amount),
      });
      toast.success('Expense recorded successfully!');
      await fetchFunds();
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to record expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-red-50 p-3 rounded-2xl">
            <Receipt className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Record Expense</h1>
            <p className="text-slate-500">Deduct an expense from a specific fund.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Source Fund *</label>
            <select
              className="input-field appearance-none"
              value={formData.fundId}
              onChange={(e) => setFormData({ ...formData, fundId: e.target.value })}
              required
            >
              <option value="">Select a fund source</option>
              {funds.map((fund) => (
                <option key={fund._id} value={fund._id}>
                  {fund.name} (Balance: ${fund.remainingAmount.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Category / Item *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Groceries, Rent, Utilities, Entertainment"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Amount ($) *</label>
              <input
                type="number"
                className="input-field"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Expense Date</label>
              <input
                type="date"
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          {isOverspending && (
            <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Budget Warning</p>
                <p className="text-xs text-amber-700">This expense exceeds the remaining balance of the selected fund.</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Notes (Optional)</label>
            <textarea
              className="input-field min-h-[100px] resize-none"
              placeholder="What was this for?"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Record Expense</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
