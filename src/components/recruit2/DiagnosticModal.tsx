'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Heart, Sparkles, Star, TrendingUp, X } from 'lucide-react';
import React, { useState } from 'react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUESTIONS = [
  {
    id: 1,
    text: '人と話すことやコミュニケーションが好きですか？',
    icon: <Heart className="h-8 w-8 text-rose-500" />,
  },
  {
    id: 2,
    text: '理想のライフスタイルを叶えるために、しっかり稼ぎたいですか？',
    icon: <TrendingUp className="h-8 w-8 text-emerald-500" />,
  },
  {
    id: 3,
    text: '美容やファッションなど、自分を磨くことに興味がありますか？',
    icon: <Sparkles className="h-8 w-8 text-amber-500" />,
  },
  {
    id: 4,
    text: '叶えたい大きな夢や目標がありますか？',
    icon: <Star className="h-8 w-8 text-indigo-500" />,
  },
  {
    id: 5,
    text: '新しい環境で、プロとしての第一歩を踏み出したいですか？',
    icon: <Check className="h-8 w-8 text-blue-500" />,
  },
];

const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [yesCount, setYesCount] = useState(0);

  const startQuiz = () => {
    setStep('quiz');
    setCurrentQuestion(0);
    setYesCount(0);
  };

  const handleAnswer = (isYes: boolean) => {
    if (isYes) setYesCount((prev) => prev + 1);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setStep('result');
    }
  };

  const resetAll = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setYesCount(0);
    onClose();
  };

  const getResult = () => {
    if (yesCount === 5) {
      return {
        title: '適性 100%!',
        desc: 'あなたこそが私たちが探していた人材です！その輝きを最大限に活かせる環境がここにあります。',
        color: 'text-amber-500',
      };
    } else if (yesCount >= 3) {
      return {
        title: '適性大!',
        desc: '素晴らしい資質を持っています。研修とサポートがあれば、すぐにトップクラスに登り詰められるはずです。',
        color: 'text-orange-500',
      };
    } else {
      return {
        title: '適性あり!',
        desc: '一歩踏み出す勇気があれば大丈夫。未経験からでも着実に成長できるプログラムをご用意しています。',
        color: 'text-blue-500',
      };
    }
  };

  const result = getResult();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={resetAll}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-800/50 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content Area */}
            <div className="p-8 pb-10">
              <AnimatePresence mode="wait">
                {step === 'intro' && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-6">
                      <img
                        src="/スピード適正診断.png"
                        alt="スピード適正診断"
                        className="h-20 w-auto"
                      />
                    </div>
                    <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
                      <p className="text-sm leading-relaxed text-slate-300">
                        簡単な5つの質問に答えるだけで、
                        <br />
                        あなたの「稼ぐ力」と適性がすぐにわかります。
                      </p>
                    </div>
                    <button
                      onClick={startQuiz}
                      className="w-full transform rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-5 text-xl font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] hover:from-orange-600 hover:to-amber-600 active:scale-[0.98]"
                    >
                      診断スタート！
                    </button>
                  </motion.div>
                )}

                {step === 'quiz' && (
                  <motion.div
                    key={`quiz-${currentQuestion}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex flex-col items-center"
                  >
                    <div className="mb-2 font-mono text-sm font-bold uppercase tracking-widest text-indigo-400">
                      Question {currentQuestion + 1} / 5
                    </div>
                    <div className="mb-6 rounded-full bg-indigo-500/10 p-4">
                      {QUESTIONS[currentQuestion].icon}
                    </div>
                    <h3 className="mb-10 text-center text-2xl font-bold leading-tight text-white">
                      {QUESTIONS[currentQuestion].text}
                    </h3>

                    <div className="grid w-full grid-cols-2 gap-4">
                      <button
                        onClick={() => handleAnswer(true)}
                        className="group flex transform flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/80 p-6 transition-all hover:border-emerald-400 hover:bg-emerald-500 active:scale-95"
                      >
                        <span className="mb-2 text-4xl grayscale group-hover:grayscale-0">🙆‍♀️</span>
                        <span className="text-lg font-bold text-white group-hover:text-slate-950">
                          はい
                        </span>
                      </button>
                      <button
                        onClick={() => handleAnswer(false)}
                        className="group flex transform flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/80 p-6 transition-all hover:border-rose-400 hover:bg-rose-500 active:scale-95"
                      >
                        <span className="mb-2 text-4xl grayscale group-hover:grayscale-0">🙅‍♀️</span>
                        <span className="text-lg font-bold text-white group-hover:text-slate-950">
                          いいえ
                        </span>
                      </button>
                    </div>

                    {/* Mascot Peek */}
                    <div className="mt-10 opacity-60">
                      <img
                        src="/sprites/idle/frame1.png"
                        alt="mascot"
                        className="h-16 w-auto animate-bounce"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 'result' && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">
                      Your Result
                    </div>
                    <h2
                      className={`mb-4 text-5xl font-black ${result.color} drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]`}
                    >
                      {result.title}
                    </h2>

                    <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                      <div className="mb-4 flex justify-center">
                        <img src="/sprites/idle/frame3.png" alt="mascot" className="h-24 w-auto" />
                      </div>
                      <p className="text-base leading-relaxed text-white">{result.desc}</p>
                    </div>

                    <div className="w-full space-y-4">
                      <button
                        onClick={resetAll}
                        className="w-full transform rounded-2xl bg-yellow-400 py-5 text-xl font-bold text-slate-950 shadow-lg transition-all hover:scale-[1.02] hover:bg-yellow-500 active:scale-[0.98]"
                      >
                        今すぐ相談してみる
                      </button>
                      <button
                        onClick={() => setStep('intro')}
                        className="w-full rounded-xl bg-slate-800 py-3 font-bold text-slate-400 transition-all hover:bg-slate-700"
                      >
                        もう一度診断する
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Bar (during quiz) */}
            {step === 'quiz' && (
              <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-400"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiagnosticModal;
