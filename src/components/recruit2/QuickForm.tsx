
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/thanks');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-16 px-4">
      <div className="container mx-auto max-w-xl">
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl p-6 sm:p-12 border border-slate-100">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3 sm:mb-4">30秒簡易応募</h2>
            <p className="text-slate-500 text-sm sm:text-base">まずは基本情報だけでOK。お気軽にお申し込みください。</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="group">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 ml-1">お名前 <span className="text-slate-400 font-normal">(ニックネーム可)</span></label>
              <input 
                required 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                placeholder="例：タカシ"
              />
            </div>

            <div className="group">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 ml-1">ご連絡先 <span className="text-slate-400 font-normal">(電話番号 or メール)</span></label>
              <input 
                required 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                placeholder="例：090-0000-0000"
              />
            </div>

            <div className="group">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 ml-1">年齢</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none transition-all">
                <option>20代</option>
                <option>30代</option>
                <option>40代</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 sm:py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-lg sm:text-xl shadow-lg transition-all flex items-center justify-center active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  送信中...
                </span>
              ) : "応募を完了する"}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] sm:text-xs text-slate-400 leading-relaxed px-4">
            お送りいただいた情報は採用選考のみに使用し、第三者への提供は行いません。
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-900 text-sm font-bold transition-colors">
            ← トップページに戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickForm;
