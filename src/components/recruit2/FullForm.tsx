
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FullForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/thanks');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">WEB本応募フォーム</h2>
            <p className="text-slate-500">詳細情報を入力いただくことで、面接までの案内がよりスムーズになります。</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-4">
              <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">基本情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">お名前 (氏名)</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">フリガナ</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">電話番号</label>
                <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">身体情報・経験</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">身長 (cm)</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">体重 (kg)</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">業界経験</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="exp" className="w-4 h-4 text-amber-600" /> <span>未経験</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="exp" className="w-4 h-4 text-amber-600" /> <span>経験者</span>
                  </label>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-bold text-slate-900 border-l-4 border-amber-500 pl-3">自己PR・写真</h3>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">自己PR / 応募動機</label>
                <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="あなたの想いや希望する活動内容をお聞かせください。"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">顔写真の添付</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50">
                  <input type="file" className="hidden" id="photo-upload" accept="image/*" />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-slate-500 text-sm">クリックしてファイルを選択</div>
                    <div className="text-slate-400 text-xs mt-1">※マスク・帽子なし、過度な加工はご遠慮ください</div>
                  </label>
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xl shadow-lg transition-all"
            >
              {loading ? "送信中..." : "詳細情報を送信する"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FullForm;
