'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 3000);
    }, 2000);
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
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="pointer-events-auto relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="h-full overflow-y-auto p-8 md:p-12">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                      🎉
                    </div>
                    <h2 className="mb-4 font-serif text-3xl font-bold text-slate-900">
                      応募を完了しました
                    </h2>
                    <p className="text-slate-600">
                      ご応募ありがとうございます。
                      <br />
                      担当者より、追ってご連絡させていただきますので
                      <br />
                      今しばらくお待ちくださいませ。
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-10 text-center">
                      <h2 className="mb-3 font-serif text-3xl font-bold text-slate-900">
                        WEB応募フォーム
                      </h2>
                      <p className="text-sm text-slate-500">まずは以下の項目をご入力ください。</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 pb-4">
                      {/* Basic Info */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-3">
                          <h3 className="font-bold text-slate-900">基本情報</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="group">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                              お名前 (氏名)
                            </label>
                            <input
                              required
                              type="text"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                              placeholder="山田 太郎"
                            />
                          </div>
                          <div className="group">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                              年齢
                            </label>
                            <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20">
                              <option>20代</option>
                              <option>30代</option>
                              <option>40代</option>
                            </select>
                          </div>
                        </div>
                        <div className="group">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            電話番号
                          </label>
                          <input
                            required
                            type="tel"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                            placeholder="090-0000-0000"
                          />
                        </div>
                      </section>

                      {/* Stats & Experience */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-3">
                          <h3 className="font-bold text-slate-900">身体情報・経験</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="group">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                              身長 (cm)
                            </label>
                            <input
                              type="number"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                              placeholder="175"
                            />
                          </div>
                          <div className="group">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                              体重 (kg)
                            </label>
                            <input
                              type="number"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                              placeholder="65"
                            />
                          </div>
                        </div>
                        <div className="group text-center sm:text-left">
                          <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            業界経験
                          </label>
                          <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="radio"
                                name="experience"
                                className="h-5 w-5 border-slate-300 text-amber-600 focus:ring-amber-500"
                              />
                              <span className="text-sm font-medium text-slate-700">未経験</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="radio"
                                name="experience"
                                className="h-5 w-5 border-slate-300 text-amber-600 focus:ring-amber-500"
                              />
                              <span className="text-sm font-medium text-slate-700">経験者</span>
                            </label>
                          </div>
                        </div>
                      </section>

                      {/* PR & Photo */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-3">
                          <h3 className="font-bold text-slate-900">自己PR・写真</h3>
                        </div>
                        <div className="group">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            自己PR / 応募動機
                          </label>
                          <textarea
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                            placeholder="あなたの想いや希望する活動内容をお聞かせください。"
                          ></textarea>
                        </div>
                        <div className="group">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            写真の添付 (任意)
                          </label>
                          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-all hover:bg-slate-100">
                            <input
                              type="file"
                              className="hidden"
                              id="modal-photo"
                              accept="image/*"
                            />
                            <label htmlFor="modal-photo" className="cursor-pointer">
                              <div className="mb-2 text-3xl">📸</div>
                              <div className="text-sm font-bold text-slate-700">
                                写真をアップロード
                              </div>
                              <div className="text-[10px] text-slate-400">
                                ※マスクなしの鮮明な写真をお願いします
                              </div>
                            </label>
                          </div>
                        </div>
                      </section>

                      <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full overflow-hidden rounded-2xl bg-amber-600 py-5 text-xl font-bold text-white shadow-xl transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-3">
                            <svg className="h-6 w-6 animate-spin text-white" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>送信中...</span>
                          </div>
                        ) : (
                          '応募内容を送信する'
                        )}
                      </button>

                      <p className="px-6 text-center text-[10px] leading-relaxed text-slate-400">
                        お送りいただいた情報は採用選考のみに使用し、厳重に管理いたします。
                        第三者への提供は一切行いません。
                      </p>
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
