'use client';

import DelayedSummonAnimation from '@/components/match/DelayedSummonAnimation'; // 追加：2秒後にカード降下
import MatchingResult from '@/components/match/MatchingResult';
import MatchingStart from '@/components/match/MatchingStart';
import StrawberryTransition from '@/components/match/StrawberryTransition'; // 🍓流れる演出
import { DUMMY_CAST_MEMBERS } from '@/data/constants';
import { MatchState } from '@/types/match';
import { useCallback, useState } from 'react';

export default function Page() {
  const [matchState, setMatchState] = useState<MatchState>(MatchState.START);

  // 🎬 「Start Matching」押下 → TRANSITION に移行
  const handleStartMatching = useCallback(() => {
    setMatchState(MatchState.TRANSITION);
  }, []);

  // ✅ SummonAnimation が終わったら RESULTS に移行
  const handleTransitionComplete = useCallback(() => {
    setMatchState(MatchState.RESULTS);
  }, []);

  const getBackgroundClass = () => {
    switch (matchState) {
      case MatchState.START:
      case MatchState.TRANSITION:
        return 'bg-gradient-to-b from-gray-900 to-black';
      case MatchState.RESULTS:
        return 'bg-gradient-to-r from-pink-600 via-red-500 to-yellow-400';
      default:
        return 'bg-black';
    }
  };

  return (
    <main
      className={`relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden p-8 text-center transition-colors duration-1000 ${getBackgroundClass()}`}
    >
      {/* === UI（タイトル・サブテキスト・ボタン）: START & TRANSITION 両方で表示 === */}
      {matchState !== MatchState.RESULTS && (
        <>
          <MatchingStart /> {/* 🍓アイコンだけ */}
          <h1 className="mt-6 text-3xl font-bold text-white drop-shadow-md sm:text-4xl md:text-5xl">
            Find Your Sweet Match
          </h1>
          <p className="mb-8 mt-2 text-base text-white/80 drop-shadow sm:text-lg">
            Tap to start the journey for your special someone.
          </p>
          <button
            onClick={handleStartMatching}
            disabled={matchState === MatchState.TRANSITION} // 連打防止
            className="transform rounded-full bg-white px-6 py-3 text-lg font-bold text-red-500 shadow-xl transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 sm:px-8 sm:py-4 sm:text-xl"
          >
            Start Matching
          </button>
        </>
      )}

      {/* === 🍓トランジション演出 === */}
      {matchState === MatchState.TRANSITION && (
        <>
          {/* 🍓流れる */}
          <StrawberryTransition />

          {/* 2秒遅れてカード降下 → 終わったら RESULTS へ */}
          <DelayedSummonAnimation delay={1000} onComplete={handleTransitionComplete} />
        </>
      )}

      {/* === 結果画面 === */}
      {matchState === MatchState.RESULTS && <MatchingResult castMembers={DUMMY_CAST_MEMBERS} />}
    </main>
  );
}
