'use client';

import { ArrowRightIcon, CheckCircle2Icon, ChevronRightIcon, HelpCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const questions = [
  {
    id: 1,
    text: '初対面の女性と話すとき、相手の目を見てリラックスして会話できますか？',
    options: ['完璧にできる', 'まあまあできる', 'あまりできない', '緊張して目をそらしてしまう'],
  },
  {
    id: 2,
    text: '自分のファッションや髪型について、第三者から褒められることがありますか？',
    options: ['頻繁にある', 'たまにある', 'ほとんどない', '身だしなみに自信がない'],
  },
  {
    id: 3,
    text: '「清潔感」を保つために、毎日欠かさず行っているルーティンはありますか？',
    options: ['3つ以上ある', '1-2個ある', '意識はしているが不定期', '特にない'],
  },
  {
    id: 4,
    text: '女性の話に対して、適切なタイミングで「共感」や「深掘り」ができますか？',
    options: [
      '自然にできる',
      '意識すればできる',
      '自分の話をしてしまいがち',
      'どう反応すればいいか分からない',
    ],
  },
];

export default function DiagnosticPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-[3rem] border border-slate-50 bg-white p-10 text-center shadow-2xl shadow-blue-100 md:p-16">
          <div className="mb-8 flex justify-center text-blue-500">
            <CheckCircle2Icon size={80} strokeWidth={1} />
          </div>
          <h1 className="mb-4 text-center font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            診断結果：エキスパート・ジェントルマン
          </h1>
          <p className="mb-10 text-center leading-relaxed text-slate-500">
            おめでとうございます！あなたはすでに高いポテンシャルを秘めています。
            さらなる高みを目指すなら、プロのセラピストとして技術とマインドを磨くことが最短ルートです。
          </p>

          <div className="mb-12 space-y-4">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 text-left">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">会話の共感力：Sランク</h4>
                <p className="text-xs text-slate-400">
                  相手の深層心理に寄り添う力が非常に高いです。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 text-left">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">外見的魅力：Aランク</h4>
                <p className="text-xs text-slate-400">
                  清潔感は十分。さらなる「色気」の演出に挑戦しましょう。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/store/fukuoka/recruit"
              className="group flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-5 text-sm font-bold text-white transition-all hover:bg-slate-700"
            >
              あなたの才能を活かせる求人をチェック{' '}
              <ArrowRightIcon
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link href="/ikeo" className="block text-sm font-bold text-blue-600 hover:underline">
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-12 text-center">
        <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-600">
          Question {currentStep + 1} of {questions.length}
        </span>
        <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-[3rem] border border-slate-50 bg-white p-10 shadow-xl md:p-16">
        <div className="mb-8 flex justify-center text-slate-200">
          <HelpCircleIcon size={48} strokeWidth={1} />
        </div>
        <h2 className="mb-12 text-center font-serif text-2xl font-bold text-slate-900 md:text-3xl">
          {question.text}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="group flex items-center justify-between rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-6 text-left transition-all hover:border-blue-500 hover:bg-white hover:shadow-lg"
            >
              <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">
                {option}
              </span>
              <ChevronRightIcon
                size={18}
                className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500"
              />
            </button>
          ))}
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-slate-400">
        ※この診断はあなたの現在のポテンシャルを測るものであり、結果は成長のヒントとしてご活用ください。
      </p>
    </div>
  );
}
