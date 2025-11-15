'use client';
import React from 'react';
import { Heart, Shield, Users, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="bg-gradient-to-b from-pink-50 to-white pb-24 pt-20 lg:pb-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-rounded text-3xl font-bold leading-tight text-gray-800 sm:text-4xl lg:text-6xl">
            あなたの時間が、
            <br />
            <span className="text-pink-500">特別な価値</span>になる場所。
          </h1>

          <p className="mb-4 font-serif text-lg text-gray-600 sm:text-xl lg:text-2xl">
            週2日から、月収50万円も可能。
            <br />
            身バレ対策・迅速なスタッフ対応で安心。
          </p>

          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            ストロベリーボーイズでは、見た目も中身も中身もハイセンスな世界観の中で、
            <br className="hidden sm:block" />
            "大人の遊び心"を共に提供してくれるセラピストを募集しています。
          </p>

          <div className="mx-auto mb-12 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() =>
                document.querySelector('#requirements')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="w-full transform rounded-full bg-pink-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-pink-600 sm:w-auto sm:text-lg"
            >
              募集要項を見る
            </button>
            <button
              onClick={() =>
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="w-full rounded-full border-2 border-pink-500 bg-white px-6 py-4 text-base font-semibold text-pink-500 transition-all hover:bg-pink-50 sm:w-auto sm:text-lg"
            >
              まずは話を聞いてみる
            </button>
            <button
              onClick={() =>
                document.querySelector('#diagnosis')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="w-full rounded-full bg-gray-100 px-6 py-4 text-base font-semibold text-gray-700 transition-all hover:bg-gray-200 sm:w-auto sm:text-lg"
            >
              30秒診断を試す
            </button>
          </div>

          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            <div className="rounded-lg bg-white p-3 text-center shadow-sm lg:p-4">
              <Shield className="mx-auto mb-2 h-6 w-6 text-pink-500 lg:h-8 lg:w-8" />
              <div className="text-xl font-bold text-gray-800 lg:text-2xl">SNSを駆使した</div>
              <div className="text-xs text-gray-600 lg:text-sm">プロデュース</div>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm lg:p-4">
              <Users className="mx-auto mb-2 h-6 w-6 text-pink-500 lg:h-8 lg:w-8" />
              <div className="text-xl font-bold text-gray-800 lg:text-2xl">24h</div>
              <div className="text-xs text-gray-600 lg:text-sm">徹底したサポート</div>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm lg:p-4">
              <TrendingUp className="mx-auto mb-2 h-6 w-6 text-pink-500 lg:h-8 lg:w-8" />
              <div className="text-xl font-bold text-gray-800 lg:text-2xl">95%</div>
              <div className="text-xs text-gray-600 lg:text-sm">満足度</div>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm lg:p-4">
              <Heart className="mx-auto mb-2 h-6 w-6 text-pink-500 lg:h-8 lg:w-8" />
              <div className="text-xl font-bold text-gray-800 lg:text-2xl">週2日</div>
              <div className="text-xs text-gray-600 lg:text-sm">から勤務OK</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
