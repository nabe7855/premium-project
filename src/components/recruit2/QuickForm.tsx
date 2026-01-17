import { submitRecruitApplication } from '@/actions/recruit';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface QuickFormProps {
  storeName?: string;
}

const QuickForm: React.FC<QuickFormProps> = ({ storeName }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('type', 'quick');
    if (storeName) {
      formData.append('store', storeName);
    }

    const result = await submitRecruitApplication(formData);

    setLoading(false);
    if (result.success) {
      router.push('/thanks');
    } else {
      setError(result.error || '送信に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-16">
      <div className="container mx-auto max-w-xl">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl sm:rounded-[3rem] sm:p-12">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="mb-3 font-serif text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl">
              30秒簡易応募
            </h2>
            <p className="text-sm text-slate-500 sm:text-base">
              まずは基本情報だけでOK。お気軽にお申し込みください。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="group">
              <label className="mb-2 ml-1 block text-xs font-bold text-slate-700 sm:text-sm">
                お名前 <span className="font-normal text-slate-400">(ニックネーム可)</span>
              </label>
              <input
                required
                name="name"
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:py-4"
                placeholder="例：タカシ"
              />
            </div>

            <div className="group">
              <label className="mb-2 ml-1 block text-xs font-bold text-slate-700 sm:text-sm">
                ご連絡先 <span className="font-normal text-slate-400">(電話番号 or メール)</span>
              </label>
              <input
                required
                name="phone"
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:py-4"
                placeholder="例：090-0000-0000"
              />
            </div>

            <div className="group">
              <label className="mb-2 ml-1 block text-xs font-bold text-slate-700 sm:text-sm">
                年齢
              </label>
              <select
                name="age"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:py-4"
              >
                <option value="20代">20代</option>
                <option value="30代">30代</option>
                <option value="40代">40代</option>
              </select>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-amber-600 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-95 disabled:opacity-70 sm:py-5 sm:text-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  送信中...
                </span>
              ) : (
                '応募を完了する'
              )}
            </button>
          </form>

          <p className="mt-8 px-4 text-center text-[10px] leading-relaxed text-slate-400 sm:text-xs">
            お送りいただいた情報は採用選考のみに使用し、第三者への提供は行いません。
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
          >
            ← トップページに戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickForm;
