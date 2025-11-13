
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  extra?: React.ReactNode;
}

// A versatile card component for displaying widgets and information
export default function Card({ title, children, className = '', extra }: CardProps) {
  return (
    <div className={`bg-brand-secondary rounded-xl shadow-lg border border-gray-700/50 p-4 md:p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-brand-text-secondary">{title}</h3>
        {extra && <div>{extra}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}