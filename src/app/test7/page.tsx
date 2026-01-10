'use client';

import AdminDashboard from '@/components/service-feedback/AdminDashboard';
import SurveyForm from '@/components/service-feedback/SurveyForm';
import { ClipboardList, LayoutDashboard } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <HashRouter>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <h1 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <span className="rounded-lg bg-indigo-600 p-1.5">
                <ClipboardList className="h-5 w-5 text-white" />
              </span>
              <span className="hidden sm:inline">アフターアンケート</span>
              <span className="sm:hidden">アンケート</span>
            </h1>
            <nav className="flex gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
              >
                アンケート回答
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
              >
                <LayoutDashboard className="h-4 w-4" />
                管理画面
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<SurveyForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-6">
          <div className="mx-auto max-w-4xl text-center text-xs text-slate-400">
            <p>&copy; 2024 Service Improvement Feedback System. Completely Anonymous.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
