
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThanksPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-xl w-full text-center bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 flex items-center justify-center rounded-full mx-auto mb-8 text-4xl shadow-inner">
          ✓
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">応募を受け付けました</h2>
        <div className="space-y-4 text-slate-600 leading-relaxed mb-10">
          <p>お申し込みいただき誠にありがとうございます。<br/>あなたの新しい一歩を、スタッフ一同歓迎いたします。</p>
          <p>
            担当者より、24時間以内に折り返しご連絡させていただきます。<br/>
            今しばらくお待ちください。
          </p>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-10 text-left">
          <h4 className="font-bold text-slate-900 mb-2">今後の流れ：</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside text-slate-600">
            <li>担当者から日程調整のご連絡</li>
            <li>店舗でのリラックス面談 (20分程度)</li>
            <li>採用・研修スタート</li>
          </ol>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all"
        >
          トップページに戻る
        </button>
      </div>
    </div>
  );
};

export default ThanksPage;
