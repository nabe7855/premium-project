
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20">
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold">
          C
        </div>
      </header>
      <main className="w-full max-w-md px-4 pt-6">
        {children}
      </main>
    </div>
  );
};
