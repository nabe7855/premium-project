'use client';

import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8 h-1.5 w-full rounded-full bg-slate-100">
      <div
        className="h-1.5 rounded-full bg-indigo-600 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <div className="mt-2 flex justify-between px-1 text-[10px] font-medium text-slate-400">
        <span>開始</span>
        <span>
          ステップ {currentStep} / {totalSteps}
        </span>
        <span>完了</span>
      </div>
    </div>
  );
};

export default ProgressBar;
