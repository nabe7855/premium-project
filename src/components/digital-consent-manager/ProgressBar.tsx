
import React from 'react';
import { Step } from '@/types/digital-consent-manager';

interface ProgressBarProps {
  currentStep: Step;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { label: '重要事項', icon: 'fa-triangle-exclamation' },
    { label: 'お客様', icon: 'fa-user' },
    { label: '担当者', icon: 'fa-id-badge' },
    { label: '確認', icon: 'fa-clipboard-check' }
  ];

  if (currentStep === Step.COMPLETED) return null;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10 w-full relative">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= index 
                  ? 'bg-rose-500 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <i className={`fas ${step.icon} text-sm`}></i>
            </div>
            <span className={`text-[10px] mt-2 font-bold ${
              currentStep >= index ? 'text-rose-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute h-[2px] w-full top-5 left-1/2 -z-10 transition-all duration-500 ${
                  currentStep > index ? 'bg-rose-500' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
