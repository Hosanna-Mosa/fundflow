import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'bg-primary-600' }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-500 ease-out ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
