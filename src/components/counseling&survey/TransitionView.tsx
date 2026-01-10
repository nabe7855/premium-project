'use client';

import React from 'react';

interface Props {
  onContinue: () => void;
  onSkip: () => void;
}

const TransitionView: React.FC<Props> = ({ onContinue, onSkip }) => {
  return (
    <div className="animate-fadeIn space-y-8 pt-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-800">カウンセリング完了</h2>
        <p className="px-4 text-sm leading-relaxed text-gray-500">
          ご回答ありがとうございました。内容は大切に保管し、当日の施術に反映させていただきます。
        </p>
      </div>

      <hr className="border-gray-100" />

      <div className="space-y-4 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-left">
        <div className="flex items-start">
          <span className="mr-2 text-xl">🎁</span>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-900">アンケート協力のお願い</h3>
            <p className="text-[12px] leading-relaxed text-amber-800">
              今後のサービス向上やYouTube企画での統計データとして活用させていただきます。
            </p>
          </div>
        </div>

        <ul className="ml-6 list-disc space-y-1 text-[11px] text-amber-700">
          <li>完全匿名・任意です</li>
          <li>回答しなくても施術に一切影響ありません</li>
          <li>個別回答を公開することはありません</li>
        </ul>
      </div>

      <div className="space-y-3 pt-4">
        <button
          onClick={onContinue}
          className="w-full rounded-xl bg-rose-500 py-4 font-bold text-white shadow-lg transition-all hover:bg-rose-600"
        >
          アンケートに回答する
        </button>
        <button
          onClick={onSkip}
          className="w-full rounded-xl border border-gray-200 bg-white py-4 font-bold text-gray-400 transition-all hover:bg-gray-50"
        >
          今回はスキップして終了
        </button>
      </div>
    </div>
  );
};

export default TransitionView;
