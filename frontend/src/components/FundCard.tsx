import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingDown, Wallet } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface FundProps {
  fund: {
    _id: string;
    name: string;
    totalAmount: number;
    usedAmount: number;
    remainingAmount: number;
    date: string;
    day?: string;
  };
}

const FundCard: React.FC<FundProps> = ({ fund }) => {
  const usagePercentage = (fund.usedAmount / fund.totalAmount) * 100;
  
  return (
    <Link to={`/funds/${fund._id}`} className="block group">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-primary-50 p-2.5 rounded-xl group-hover:bg-primary-100 transition-colors">
            <Wallet className="w-6 h-6 text-primary-600" />
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 transition-colors" />
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-1">{fund.name}</h3>
        <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-tight">
          {fund.day ? `${fund.day}, ` : ''}{new Date(fund.date).toLocaleDateString()}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total</p>
            <p className="text-lg font-bold text-slate-900">${fund.totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Remaining</p>
            <p className="text-lg font-bold text-primary-600">${fund.remainingAmount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500 flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              Used: ${fund.usedAmount.toLocaleString()}
            </span>
            <span className={usagePercentage > 90 ? 'text-red-500' : 'text-slate-500'}>
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <ProgressBar 
            progress={usagePercentage} 
            color={usagePercentage > 90 ? 'bg-red-500' : 'bg-primary-600'} 
          />
        </div>
      </div>
    </Link>
  );
};

export default FundCard;
