'use client';

import React from 'react';

interface Props {
  onNext: () => void;
  nickname: string;
  setNickname: (val: string) => void;
}

const IntroView: React.FC<Props> = ({ onNext, nickname, setNickname }) => {
  return (
    <div className="animate-fadeIn space-y-8">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
          <svg
            className="h-10 w-10 text-rose-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Counseling Sheet</h1>
        <p className="px-4 text-sm leading-relaxed text-gray-500">
          本日はご予約ありがとうございます。
          <br />
          より心地よい体験を提供するため、事前カウンセリングへの回答をお願いしております。
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <h3 className="flex items-center text-sm font-bold text-blue-800">
          <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          プライバシーについて
        </h3>
        <ul className="ml-2 space-y-1 text-xs text-blue-700">
          <li>・本名や住所などの個人情報は収集しません</li>
          <li>・回答内容は担当セラピストのみが閲覧します</li>
          <li>・完了後に任意アンケート（統計用）がございます</li>
        </ul>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          ニックネーム <span className="text-xs font-normal text-gray-400">(任意)</span>
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例：はなこ"
          className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
        />
        <p className="text-[10px] text-gray-400">※後ほどアンケート等でそのまま使用されます。</p>
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-xl bg-rose-500 py-4 font-bold text-white shadow-lg shadow-rose-100 transition-all hover:bg-rose-600 active:scale-[0.98]"
      >
        カウンセリングを始める
      </button>

      <p className="text-center text-[11px] text-gray-400">目安回答時間：約3〜5分</p>
    </div>
  );
};

export default IntroView;
