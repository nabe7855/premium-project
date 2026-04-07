'use client';

import { submitRecruitApplication } from '@/actions/recruit';
import { resizeImage } from '@/lib/image-utils';
import { getAttributionData } from '@/lib/attribution';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FullFormProps {
  storeName?: string;
  storeSlug?: string;
}

const FullForm: React.FC<FullFormProps> = ({ storeName, storeSlug }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<number, string>>({});

  const handleFileChange = (num: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [num]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('type', 'full');
    formData.append('store', storeSlug || storeName || '不明');

    // アトリビューションデータの付与 (Stealth)
    const attribution = getAttributionData();
    if (attribution) {
      formData.append('attribution', JSON.stringify(attribution));
    }

    // 画像の圧縮処理
    formData.delete('photos');
    const photoNumbers = Object.keys(previews).map(Number);
    for (const num of photoNumbers) {
      try {
        const blob = await resizeImage(previews[num]);
        formData.append('photos', new File([blob], `photo_${num}.jpg`, { type: 'image/jpeg' }));
      } catch (imgError) {
        console.error('Image processing error:', imgError);
        const res = await fetch(previews[num]);
        const blob = await res.blob();
        formData.append('photos', new File([blob], `photo_${num}.jpg`, { type: 'image/jpeg' }));
      }
    }

    try {
      const result = await submitRecruitApplication(formData);

      setLoading(false);
      if (result && result.success) {
        navigate('/thanks');
      } else {
        setError(result?.error || '送信に失敗しました。詳細を確認してください。');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setLoading(false);
      setError('通信エラーが発生しました。ネットワーク状況を確認してください。');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="container mx-auto max-w-2xl">
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl md:p-12">
          <div className="mb-10 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-slate-900">WEB本応募フォーム</h2>
            <p className="text-slate-500">
              詳細情報を入力いただくことで、面接までの案内がよりスムーズになります。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-4">
              <h3 className="border-l-4 border-amber-500 pl-3 font-bold text-slate-900">
                基本情報
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    お名前 (必須)
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    placeholder="例：山田 太郎"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">フリガナ</label>
                  <input
                    name="furigana"
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    placeholder="例：ヤマダ タロウ"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    電話番号 (必須)
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    placeholder="例：09012345678"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    メールアドレス (必須)
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    placeholder="例：example@example.com"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="border-l-4 border-amber-500 pl-3 font-bold text-slate-900">
                身体情報・経験
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">身長 (cm)</label>
                  <input
                    name="height"
                    type="number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">体重 (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">業界経験</label>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="therapist_exp"
                      value="no"
                      className="h-4 w-4 text-amber-600"
                    />{' '}
                    <span>未経験</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="therapist_exp"
                      value="yes"
                      className="h-4 w-4 text-amber-600"
                    />{' '}
                    <span>経験者</span>
                  </label>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="border-l-4 border-amber-500 pl-3 font-bold text-slate-900">
                自己PR・写真
              </h3>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  自己PR / 応募動機
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  placeholder="あなたの想いや希望する活動内容をお聞かせください。"
                ></textarea>
              </div>
              <div>
                <label className="mb-4 block text-sm font-bold text-slate-700">写真の添付</label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="group relative">
                      <input
                        type="file"
                        className="hidden"
                        id={`photo-full-${num}`}
                        name="photos"
                        accept="image/*"
                        onChange={(e) => handleFileChange(num, e)}
                      />
                      <label
                        htmlFor={`photo-full-${num}`}
                        className="flex aspect-[3/4] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:bg-slate-100"
                      >
                        {previews[num] ? (
                          <img
                            src={previews[num]}
                            className="h-full w-full object-cover"
                            alt={`Preview ${num}`}
                          />
                        ) : (
                          <div className="text-center">
                            <div className="mb-1 text-2xl">📷</div>
                            <div className="text-[10px] font-bold text-slate-400">Photo {num}</div>
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-xs text-slate-400">
                  ※マスク・帽子なし、過度な加工はご遠慮ください
                </p>
              </div>
            </section>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 py-5 text-xl font-bold text-white shadow-lg transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? '送信中...' : '詳細情報を送信する'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FullForm;
