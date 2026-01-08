
import React from 'react';

export const StrawberryChan: React.FC<{ text: string, className?: string }> = ({ text, className }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-strawberry overflow-hidden bg-white shadow-md">
      <img src="https://picsum.photos/seed/ichigo/100/100" alt="苺ちゃん" className="w-full h-full object-cover" />
    </div>
    <div className="relative bg-white border border-stone-200 rounded-2xl p-3 shadow-sm">
      <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-l border-b border-stone-200 rotate-45"></div>
      <p className="text-sm font-bold text-strawberry leading-relaxed">{text}</p>
    </div>
  </div>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: string; light?: boolean }> = ({ title, subtitle, light }) => (
  <div className="text-center mb-12">
    {subtitle && <p className={`text-sm font-bold tracking-widest uppercase mb-2 ${light ? 'text-stone-300' : 'text-strawberry'}`}>{subtitle}</p>}
    <h2 className={`text-2xl md:text-3xl font-black ${light ? 'text-white' : 'text-stone-900'}`}>{title}</h2>
    <div className={`w-16 h-1 mx-auto mt-4 rounded-full ${light ? 'bg-gold' : 'bg-strawberry'}`}></div>
  </div>
);
