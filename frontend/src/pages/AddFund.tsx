import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fundService } from '../services/api';
import { useStore } from '../store/useStore';
import { ArrowLeft, Wallet, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const AddFund: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const fetchFunds = useStore((state) => state.fetchFunds);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.totalAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await fundService.createFund({
        ...formData,
        totalAmount: Number(formData.totalAmount),
      });
      toast.success('Fund created successfully!');
      await fetchFunds();
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create fund');
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
          <div className="bg-primary-50 p-3 rounded-2xl">
            <Wallet className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Fund</h1>
            <p className="text-slate-500">Initialize a new source of income.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Fund Name / Source *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Monthly Salary, Freelance Work, Bonus"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Received Date</label>
              <input
                type="date"
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Notes (Optional)</label>
            <textarea
              className="input-field min-h-[100px] resize-none"
              placeholder="Add some context about this fund..."
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
                <span>Create Fund</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFund;
