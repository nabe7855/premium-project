'use client';

import { submitRecruitApplication } from '@/actions/recruit';
import { resizeImage } from '@/lib/image-utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  storeSlug?: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  storeName,
  storeSlug,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    console.warn('!!! handleSubmit TRIGGERED !!!');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    
    console.log('Form Values from FormData:', { name, phone, email });
    
    if (!name || !phone || !email) {
      console.error('❌ Validation Failed: Required fields missing');
      setError('必須項目（お名前・電話番号・メールアドレス）を入力してください。');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a fresh FormData to ensure clean handling of images
      const dataToSend = new FormData(form);
      dataToSend.append('type', 'fullmodal');
      if (storeName) {
        dataToSend.append('store', storeSlug || storeName || '不明');
      }

      // 1. Resizing Images
      dataToSend.delete('photos');
      const photoNumbers = Object.keys(previews).map(Number);
      
      for (const num of photoNumbers) {
        if (!previews[num]) continue;
        try {
          console.log(`📸 Resizing photo ${num}...`);
          const blob = await resizeImage(previews[num]);
          dataToSend.append('photos', new File([blob], `photo_${num}.jpg`, { type: 'image/jpeg' }));
        } catch (imgError) {
          console.error(`❌ Image ${num} resizing failed, falling back to original:`, imgError);
          const res = await fetch(previews[num]);
          const blob = await res.blob();
          dataToSend.append('photos', new File([blob], `photo_${num}.jpg`, { type: 'image/jpeg' }));
        }
      }

      console.warn('📡 Sending data to server action...');
      const result = await submitRecruitApplication(dataToSend);
      console.warn('✅ Server response:', result);

      setLoading(false);
      if (result && result.success) {
        setSubmitted(true);
        // Reset previews
        setPreviews({});
        // Close after a delay
        setTimeout(() => {
          onClose();
          setSubmitted(false);
        }, 5000);
      } else {
        setError(result?.error || '送信に失敗しました。時間をおいて再度お試しください。');
      }
    } catch (err: any) {
      console.error('❌ Unexpected Error during submission:', err);
      setError('通信エラーが発生しました。ネットワーク接続を確認してください。');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4"
          >
            <div className="pointer-events-auto relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:right-6 sm:top-6"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-8 sm:px-12 sm:py-12">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                      🎉
                    </div>
                    <h2 className="mb-4 font-serif text-3xl font-bold text-slate-900">
                      応募を受付いたしました
                    </h2>
                    <p className="text-slate-600">
                      ご協力ありがとうございます。<br />
                      審査を通過された方にのみ、担当者より数日以内にご連絡を差し上げます。<br />
                      今しばらくお待ちくださいませ。
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-10 text-center">
                      <h2 className="mb-3 font-serif text-3xl font-bold text-slate-900">
                        応募フォーム
                      </h2>
                      <p className="text-sm text-slate-500">
                        以下の項目をご入力の上、送信してください。
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 pb-4">
                      {/* 1. 基本情報 */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-3">
                          <h3 className="font-bold text-slate-900">1. 基本情報</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                             <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">お名前 (必須)</label>
                                <input required name="name" type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20" placeholder="例：山田 太郎" />
                             </div>
                             <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">フリガナ</label>
                                <input name="furigana" type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20" placeholder="例：ヤマダ タロウ" />
                             </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">お電話番号 (必須)</label>
                              <input required name="phone" type="tel" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20" placeholder="例：090-1234-5678" />
                            </div>
                            <div>
                              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">メールアドレス (必須)</label>
                              <input required name="email" type="email" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20" placeholder="例：apply@example.com" />
                            </div>
                          </div>

                          <div>
                             <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">現在の住所</label>
                             <input name="address" type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20" placeholder="例：福岡市博多区" />
                          </div>

                          <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            <div>
                                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">年齢</label>
                                <input name="age" type="number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-center outline-none focus:border-amber-500 focus:bg-white sm:px-4" placeholder="25" />
                            </div>
                            <div>
                                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">身長 (cm)</label>
                                <input name="height" type="number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-center outline-none focus:border-amber-500 focus:bg-white sm:px-4" placeholder="175" />
                            </div>
                            <div>
                                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">体重 (kg)</label>
                                <input name="weight" type="number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-center outline-none focus:border-amber-500 focus:bg-white sm:px-4" placeholder="65" />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* 2. 職歴・資格 */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-3">
                          <h3 className="font-bold text-slate-900">2. 経験・資格</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="mb-2 block text-xs font-bold text-slate-500">現在の就業状況</label>
                            <div className="flex gap-4">
                              <label className="flex cursor-pointer items-center gap-2">
                                <input type="radio" name="employment" value="就業中" className="text-amber-600" />
                                <span className="text-sm">就業中</span>
                              </label>
                              <label className="flex cursor-pointer items-center gap-2">
                                <input type="radio" name="employment" value="なし" className="text-amber-600" />
                                <span className="text-sm">なし</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-bold text-slate-500">資格内容</label>
                            <textarea name="qualifications" rows={2} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white" placeholder="例：普通自動車免許 (2017年), 基本情報技術者..." />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-bold text-slate-500">主な業務経歴</label>
                            <textarea name="experience" rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white" placeholder="これまでの職歴や現在の仕事内容など" />
                          </div>
                        </div>
                      </section>

                      {/* 3. 重要確認事項 */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-3">
                          <h3 className="font-bold text-slate-900">3. 確認事項</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                             <label className="mb-2 block text-xs font-bold text-slate-500">セラピスト経験</label>
                             <div className="flex gap-6">
                               <label className="flex cursor-pointer items-center gap-2 font-medium">
                                 <input type="radio" name="therapist_exp" value="なし" defaultChecked className="text-amber-600" /> なし
                               </label>
                               <label className="flex cursor-pointer items-center gap-2 font-medium">
                                 <input type="radio" name="therapist_exp" value="あり" className="text-amber-600" /> あり
                               </label>
                             </div>
                          </div>

                          <div>
                             <label className="mb-2 block text-xs font-bold text-slate-500">YouTube動画への顔出し</label>
                             <div className="flex flex-wrap gap-x-6 gap-y-2">
                               <label className="flex cursor-pointer items-center gap-2 text-sm">
                                 <input type="radio" name="youtube" value="はい" className="text-amber-600" /> はい
                               </label>
                               <label className="flex cursor-pointer items-center gap-2 text-sm">
                                 <input type="radio" name="youtube" value="いいえ" className="text-amber-600" /> いいえ
                               </label>
                               <label className="flex cursor-pointer items-center gap-2 text-sm">
                                 <input type="radio" name="youtube" value="マスクのみOK" className="text-amber-600" /> マスクならOK
                               </label>
                             </div>
                          </div>

                          <div>
                             <label className="mb-2 block text-xs font-bold text-slate-500">深夜の車・バイク移動</label>
                             <div className="flex gap-6">
                               <label className="flex cursor-pointer items-center gap-2 font-medium">
                                 <input type="radio" name="transport" value="可能" className="text-amber-600" /> 可能
                               </label>
                               <label className="flex cursor-pointer items-center gap-2 font-medium">
                                 <input type="radio" name="transport" value="不可" className="text-amber-600" /> 不可
                               </label>
                             </div>
                          </div>

                          <div>
                             <label className="mb-2 block text-xs font-bold text-slate-500">出会い系アプリを利用したことがあるか？</label>
                             <div className="flex gap-6">
                               <label className="flex cursor-pointer items-center gap-2 font-medium">
                                 <input type="radio" name="dating_app_exp" value="あり" className="text-amber-600" /> あり
                               </label>
                               <label className="flex cursor-pointer items-center gap-2 font-medium">
                                 <input type="radio" name="dating_app_exp" value="無し" className="text-amber-600" /> 無し
                               </label>
                             </div>
                          </div>

                          <div>
                             <label className="mb-2 block text-xs font-bold text-slate-500">刺青</label>
                             <div className="flex gap-6">
                               <label className="flex cursor-pointer items-center gap-2 font-medium">
                                 <input type="radio" name="tattoo" value="あり" className="text-amber-600" /> あり
                               </label>
                               <label className="flex cursor-pointer items-center gap-2 font-medium">
                                 <input type="radio" name="tattoo" value="無し" className="text-amber-600" /> 無し
                               </label>
                             </div>
                          </div>

                          <div>
                             <label className="mb-2 block text-xs font-bold text-slate-500">容姿に気になる事はありますか？</label>
                             <textarea name="appearance_concerns" rows={2} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white" placeholder="例 肌荒れ 体臭" />
                          </div>
                        </div>
                      </section>

                      {/* 4. アンケート・自由記述 */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-3">
                          <h3 className="font-bold text-slate-900">4. アンケート・PR</h3>
                        </div>

                        <div className="space-y-4">
                           <div>
                              <label className="mb-2 block text-xs font-bold text-slate-500">知った経緯・検索ワード</label>
                              <input name="source" type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="例：ネット検索、KaikanWorkなど" />
                           </div>

                           <div>
                              <label className="mb-2 block text-xs font-bold text-slate-500">自己PR・伝えたいこと</label>
                              <textarea name="message" rows={5} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="※重要事項となりますので、些細なことでも大丈夫です。できる範囲でご記入いただけますと幸いです。" />
                           </div>

                           <div className="space-y-3">
                             <label className="block text-xs font-bold text-slate-500">写真の添付 (最大3枚)</label>
                             <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3].map((num) => (
                                  <div key={num} className="group relative">
                                    <input type="file" className="hidden" id={`photo-${num}`} name="photos" accept="image/*" onChange={(e) => handleFileChange(num, e)} />
                                    <label htmlFor={`photo-${num}`} className="flex aspect-[3/4] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-amber-500 hover:bg-white">
                                      {previews[num] ? (
                                        <img src={previews[num]} className="h-full w-full object-cover" alt={`Preview ${num}`} />
                                      ) : (
                                        <div className="text-center text-slate-300">
                                          <div className="mb-1 text-2xl">📷</div>
                                          <div className="text-[10px] font-bold">Photo {num}</div>
                                        </div>
                                      )}
                                    </label>
                                  </div>
                                ))}
                             </div>
                             <p className="text-[10px] text-slate-400">※加工、マスク、過度なトリミングは選考に影響する場合がございます。</p>
                           </div>
                        </div>
                      </section>

                      <div className="mt-10 space-y-4">
                        {error && (
                          <div className="rounded-xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">
                             {error}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-2xl bg-amber-600 py-6 text-xl font-black text-white shadow-xl shadow-amber-900/10 transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-50"
                        >
                          {loading ? '送信中...' : 'この内容で応募する'}
                        </button>
                        
                        <p className="px-6 text-center text-[10px] leading-relaxed text-slate-400">
                           お送りいただいた情報は採用選考のみに使用し、厳重に管理いたします。
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ApplicationModal;
