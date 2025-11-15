'use client';

import React, { useState } from 'react';
import { ThumbsUp, Hand as HandWave, BarChart3 } from 'lucide-react';

export const FeedbackSection: React.FC = () => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFeedback = (type: 'satisfied' | 'concerned') => {
    setFeedback(type);
  };

  return (
    <section className="bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-sm sm:max-w-2xl lg:max-w-4xl">
        <div className="rounded-lg bg-white p-4 text-center shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-center sm:mb-6">
            <BarChart3 className="mr-3 flex-shrink-0 text-red-600" size={20} />
            <h3 className="font-sans text-lg font-bold text-gray-800 sm:text-xl">
              満足度フィードバック
            </h3>
          </div>

          <p className="mb-6 font-serif text-base text-gray-700 sm:mb-8 sm:text-lg">
            この内容で安心いただけましたか？
          </p>

          {!feedback ? (
            <div className="space-y-3 sm:flex sm:justify-center sm:gap-4 sm:space-y-0">
              <button
                onClick={() => handleFeedback('satisfied')}
                className="flex w-full items-center justify-center rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800 transition-colors hover:bg-green-200 sm:w-auto sm:text-base"
              >
                <ThumbsUp className="mr-2 flex-shrink-0" size={18} />
                はい、安心しました
              </button>

              <button
                onClick={() => handleFeedback('concerned')}
                className="flex w-full items-center justify-center rounded-lg bg-yellow-100 px-4 py-3 text-sm text-yellow-800 transition-colors hover:bg-yellow-200 sm:w-auto sm:text-base"
              >
                <HandWave className="mr-2 flex-shrink-0" size={18} />
                まだ不安があります
              </button>
            </div>
          ) : (
            <div className="text-center">
              {feedback === 'satisfied' ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 sm:p-6">
                  <ThumbsUp className="mx-auto mb-3 text-green-600 sm:mb-4" size={28} />
                  <p className="font-serif text-sm text-green-800 sm:text-base">
                    ありがとうございます！安心してご利用ください。
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 sm:p-6">
                  <HandWave className="mx-auto mb-3 text-yellow-600 sm:mb-4" size={28} />
                  <p className="mb-3 font-serif text-sm text-yellow-800 sm:mb-4 sm:text-base">
                    お聞かせいただきありがとうございます。
                    <br />
                    さらに詳しいご相談は、お問い合わせフォームからお気軽にどうぞ。
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center font-serif text-sm text-red-600 underline hover:text-red-700 sm:text-base"
                  >
                    お問い合わせフォームへ
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
