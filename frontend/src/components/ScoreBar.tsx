import React from 'react';

interface ScoreBarProps {
  score: number;
  label: string;
  type: 'risk' | 'confidence';
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, label, type }) => {
  const getColor = () => {
    if (type === 'risk') {
      if (score > 70) return 'bg-red-500';
      if (score > 40) return 'bg-sandhan-yellow';
      return 'bg-sandhan-green';
    } else {
      if (score > 80) return 'bg-sandhan-green';
      if (score > 50) return 'bg-sandhan-yellow';
      return 'bg-red-500';
    }
  };

  const getTextColor = () => {
    if (type === 'risk') {
      if (score > 70) return 'text-red-400';
      if (score > 40) return 'text-sandhan-yellow';
      return 'text-sandhan-green';
    } else {
      if (score > 80) return 'text-sandhan-green';
      if (score > 50) return 'text-sandhan-yellow';
      return 'text-red-400';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-medium text-gray-400">{label}</span>
        <span className={`text-sm font-bold ${getTextColor()}`}>{score.toFixed(1)}{type === 'confidence' ? '%' : ''}</span>
      </div>
      <div className="h-1.5 w-full bg-sandhan-blue-900 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-1000 ease-out`} 
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;
