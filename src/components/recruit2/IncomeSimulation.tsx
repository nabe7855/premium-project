'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface IncomeSimulationProps {
  isOpen: boolean;
  onClose: () => void;
}

type MessageType = 'bot' | 'user';

interface Message {
  id: string;
  type: MessageType;
  content: React.ReactNode;
}

const IncomeSimulation: React.FC<IncomeSimulationProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    time: '',
    days: 0,
    mbti: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting when modal opens
  useEffect(() => {
    if (isOpen && step === 0) {
      setMessages([
        {
          id: 'init-1',
          type: 'bot',
          content: 'こんにちは！✨\n30秒であなたの収入ポテンシャルを診断します。',
        },
        {
          id: 'init-2',
          type: 'bot',
          content: 'まずは、希望の勤務時間帯を教えてください！⏰',
        },
      ]);
      setStep(1);
    } else if (!isOpen) {
      // Reset state when closed
      setTimeout(() => {
        setMessages([]);
        setStep(0);
        setSelections({ time: '', days: 0, mbti: '' });
      }, 500);
    }
  }, [isOpen]);

  const handleOptionClick = (value: string | number, type: 'time' | 'days' | 'mbti') => {
    // Add user response
    const newMessages = [
      ...messages,
      {
        id: `user-${Date.now()}`,
        type: 'user' as const,
        content: typeof value === 'number' ? `週${value}日` : value,
      },
    ];
    setMessages(newMessages);

    // Update selection state
    const newSelections = { ...selections, [type]: value };
    setSelections(newSelections);

    // Process next step with a small delay for "thinking" effect
    setTimeout(() => {
      let botResponse: Message[] = [];
      let nextStep = step + 1;

      if (type === 'time') {
        const timeFeedback =
          value === '日中'
            ? '日中はライバルが少なくて狙い目ですよ！☀️'
            : value === '深夜'
              ? '深夜は高単価なお客様が多いです！🌙'
              : 'その時間は稼ぎやすい時間帯ですね！💰';

        botResponse = [
          {
            id: `bot-${Date.now()}-1`,
            type: 'bot',
            content: timeFeedback,
          },
          {
            id: `bot-${Date.now()}-2`,
            type: 'bot',
            content: '次に、週に何日くらい勤務できそうですか？📅',
          },
        ];
        nextStep = 2;
      } else if (type === 'days') {
        botResponse = [
          {
            id: `bot-${Date.now()}-1`,
            type: 'bot',
            content: `週${value}日ですね！ありがとうございます。`,
          },
          {
            id: `bot-${Date.now()}-2`,
            type: 'bot',
            content: '最後に、あなたの性格に近いのはどちらですか？🤔',
          },
        ];
        nextStep = 3;
      } else if (type === 'mbti') {
        nextStep = 4; // Result step
        // Calculate result logic
        let baseIncome = 30; // base
        if (newSelections.days >= 4) baseIncome += 20;
        if (newSelections.days >= 5) baseIncome += 30;
        if (newSelections.time === '夜' || newSelections.time === '深夜') baseIncome += 10;

        const predictedIncome = baseIncome + Math.floor(Math.random() * 20); // range

        botResponse = [
          {
            id: `bot-${Date.now()}-1`,
            type: 'bot',
            content: (
              <div className="text-center">
                <p className="mb-2 text-sm">診断完了！🎉</p>
                <p className="mb-4">あなたの想定月収は...</p>
                <div className="mb-4 text-4xl font-bold text-amber-500">
                  {predictedIncome}
                  <span className="text-xl text-white">万円</span>
                </div>
                <p className="mb-2 text-sm text-slate-300">
                  {value === '聞き上手'
                    ? '聞き上手なあなたは、お客様の心を掴むのが得意！リピーター獲得で安定収入が見込めます。'
                    : '話し上手なあなたは、場を盛り上げる才能アリ！新規のお客様をどんどん獲得できるでしょう。'}
                </p>
                <div className="mt-4 rounded-lg border border-amber-500/50 bg-amber-600/20 p-4">
                  <p className="mb-2 font-bold text-amber-400">🎁 特別オファー発生！</p>
                  <p className="mb-3 text-xs">
                    あなたの適性は非常に高いです！
                    <br />
                    即戦力候補として「入店費用完全免除」の権利を付与します。
                  </p>
                  <button
                    onClick={() => {
                      const text = `【特別オファー適用希望】\n診断結果：月収${predictedIncome}万円\n性格：${value}\n勤務：${newSelections.time}・週${newSelections.days}\n特典：入店費用免除`;
                      navigator.clipboard.writeText(text);
                      alert('結果をコピーしました！LINEで送信してください。');
                      window.location.href = 'https://line.me/R/ti/p/@example'; // Replace with actual LINE link
                    }}
                    className="w-full rounded bg-green-600 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    LINEで結果を送って応募
                  </button>
                  <p className="mt-2 text-[10px] text-slate-400">
                    ※面接時にこの画面またはコピーしたテキストをご提示ください
                  </p>
                </div>
              </div>
            ),
          },
        ];
      }

      setMessages((prev) => [...prev, ...botResponse]);
      setStep(nextStep);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 bg-slate-950 p-4">
            <h3 className="font-bold text-white">💰 収入シミュレーション</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    msg.type === 'user'
                      ? 'rounded-tr-none bg-amber-600 text-white'
                      : 'rounded-tl-none border border-slate-700 bg-slate-800 text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area (Options) */}
          <div className="border-t border-slate-700 bg-slate-950 p-4">
            {step === 1 && (
              <div className="grid grid-cols-2 gap-2">
                {['日中', '夕方', '夜', '深夜'].map((time) => (
                  <button
                    key={time}
                    onClick={() => handleOptionClick(time, 'time')}
                    className="rounded-lg border border-slate-600 bg-slate-800 p-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <button
                    key={day}
                    onClick={() => handleOptionClick(day, 'days')}
                    className="rounded-lg border border-slate-600 bg-slate-800 p-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
                  >
                    {day}日
                  </button>
                ))}
              </div>
            )}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-2">
                {['聞き上手 👂', '話し上手 🗣️', 'マイペース 🚶', 'リーダー気質 🔥'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleOptionClick(type.split(' ')[0], 'mbti')}
                    className="rounded-lg border border-slate-600 bg-slate-800 p-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
            {step === 4 && (
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-slate-600 bg-transparent p-3 text-sm text-slate-400 hover:bg-slate-900"
              >
                閉じる
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IncomeSimulation;
