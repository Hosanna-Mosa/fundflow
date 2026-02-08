import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { expenseService } from '../services/api';
import { useStore } from '../store/useStore';
import { ArrowLeft, Pencil, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    note: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fundInfo, setFundInfo] = useState<{ name: string; remainingAmount: number } | null>(null);
  
  const navigate = useNavigate();
  const fetchFunds = useStore((state) => state.fetchFunds);
  const funds = useStore((state) => state.funds);

  useEffect(() => {
    const fetchExpense = async () => {
      if (!id) return;
      try {
        const response = await expenseService.getExpense(id);
        const expense = response.data;
        setFormData({
          amount: expense.amount.toString(),
          category: expense.category,
          date: new Date(expense.date).toISOString().split('T')[0],
          note: expense.note || '',
        });

        // Find associated fund info
        const fund = funds.find(f => f._id === expense.fundId);
        if (fund) {
          setFundInfo({ name: fund.name, remainingAmount: fund.remainingAmount + expense.amount });
        }
      } catch (error: any) {
        toast.error('Failed to fetch expense details');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, navigate, funds]);

  const isOverspending = fundInfo && Number(formData.amount) > fundInfo.remainingAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData.amount || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await expenseService.updateExpense(id, {
        ...formData,
        amount: Number(formData.amount),
      });
      toast.success('Expense updated successfully!');
      await fetchFunds();
      navigate(-1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
          <div className="bg-primary-50 p-3 rounded-2xl">
            <Pencil className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Expense</h1>
            <p className="text-slate-500">Update details for this transaction.</p>
          </div>
        </div>

        {fundInfo && (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Source Fund</p>
            <p className="text-sm font-bold text-slate-700">{fundInfo.name}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Category / Item *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Groceries, Rent, Utilities"
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
                <p className="text-xs text-amber-700">This adjustment exceeds the available balance of the fund.</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Notes (Optional)</label>
            <textarea
              className="input-field min-h-[100px] resize-none"
              placeholder="Update notes..."
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
                <span>Update Expense</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
