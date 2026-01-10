'use client';

import React from 'react';

const CompleteView: React.FC = () => {
  return (
    <div className="animate-fadeIn flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-rose-50 text-rose-500">
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.757c1.27 0 2.539.6 3.037 1.8.103.24.168.497.189.76l.16 2.053c.125 1.583-.435 3.125-1.535 4.225-1.1 1.1-2.642 1.66-4.225 1.535l-2.053-.16a1.5 1.5 0 01-1.332-1.333l-.16-2.053a4.5 4.5 0 00-4.5-4.5h-4.757c-1.27 0-2.539-.6-3.037-1.8a2.502 2.502 0 01-.189-.76l-.16-2.053c-.125-1.583.435-3.125 1.535-4.225C4.242 1.66 5.784 1.1 7.367 1.225l2.053.16a1.5 1.5 0 011.332 1.333l.16 2.053a4.5 4.5 0 004.5 4.5z"
          />
        </svg>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-800">送信が完了しました</h2>
        <p className="text-sm text-gray-500">
          貴重なお時間をありがとうございました。
          <br />
          当日のご来店を、心よりお待ちしております。
        </p>
      </div>
      <p className="text-[10px] text-gray-300">※ブラウザを閉じて終了してください。</p>
    </div>
  );
};

export default CompleteView;
