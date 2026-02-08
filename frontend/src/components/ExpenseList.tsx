import React from 'react';
import { Trash2, Calendar, Tag, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  day?: string;
  note?: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  const navigate = useNavigate();

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500 font-medium">No expenses recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div 
          key={expense._id} 
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:shadow-sm transition-shadow gap-4"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-slate-100 p-2.5 rounded-lg shrink-0">
              <Tag className="w-5 h-5 text-slate-600" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-800 truncate">{expense.category}</h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="flex items-center whitespace-nowrap">
                  <Calendar className="w-3 h-3 mr-1" />
                  {expense.day ? `${expense.day}, ` : ''}{new Date(expense.date).toLocaleDateString()}
                </span>
                {expense.note && <span className="truncate italic">"{expense.note}"</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end space-x-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
            <span className="text-lg font-bold text-slate-900 mr-4">-${expense.amount.toLocaleString()}</span>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => navigate(`/edit-expense/${expense._id}`)}
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                title="Edit Expense"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(expense._id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Expense"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
