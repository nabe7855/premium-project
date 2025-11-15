'use client';
import React, { useState } from 'react';
import { ChevronRight, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
}

const WorkStyleDiagnosis: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const questions: Question[] = [
    {
      id: 'schedule',
      question: '希望する働き方スタイルは？',
      options: ['平日中心', '週末中心', '夜間中心', '自由に調整したい'],
    },
    {
      id: 'income',
      question: '理想の月収額は？',
      options: ['20-30万円', '30-40万円', '40-50万円', '50万円以上'],
    },
    {
      id: 'priority',
      question: '重視する働き方の条件は？',
      options: ['高収入', '自由なシフト', '安心・安全', '成長・スキルアップ'],
    },
    {
      id: 'concern',
      question: '不安に思うことは？',
      options: ['プライバシー', '人間関係', '技術・スキル', '体調管理'],
    },
    {
      id: 'goal',
      question: '将来の目標は？',
      options: ['経済的自立', 'スキル向上', '人間的成長', '新しい挑戦'],
    },
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    // 簡単な診断ロジック
    const priorityIndex = answers.findIndex((a) =>
      ['高収入', '自由なシフト', '安心・安全', '成長・スキルアップ'].includes(a),
    );

    if (priorityIndex === 0) {
      return {
        type: 'プレミアムプリンセス',
        description:
          '高収入を重視するあなたには、集中的に働いて高収入を得るスタイルがおすすめです。',
        income: '月収40-60万円',
        features: ['週3-4日勤務', '高時給保証', '個別サポート'],
        color: 'from-purple-400 to-pink-400',
      };
    } else if (priorityIndex === 1) {
      return {
        type: '自由なライフスタイル',
        description: '自由度を重視するあなたには、柔軟なシフトで働くスタイルがおすすめです。',
        income: '月収20-40万円',
        features: ['自由シフト', '副業OK', '短時間勤務'],
        color: 'from-blue-400 to-cyan-400',
      };
    } else if (priorityIndex === 2) {
      return {
        type: '安心・安全重視',
        description: '安心を重視するあなたには、サポート体制が充実した環境がおすすめです。',
        income: '月収25-45万円',
        features: ['完全個室', '女性スタッフ常駐', '24時間サポート'],
        color: 'from-green-400 to-teal-400',
      };
    } else {
      return {
        type: '成長志向',
        description: 'スキルアップを重視するあなたには、研修制度が充実した環境がおすすめです。',
        income: '月収30-50万円',
        features: ['研修制度', 'キャリアサポート', 'スキル認定'],
        color: 'from-orange-400 to-red-400',
      };
    }
  };

  const resetDiagnosis = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const result = getResult();
    return (
      <section id="diagnosis" className="bg-gradient-to-b from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-center">
                <Sparkles className="mr-2 h-8 w-8 text-pink-500" />
                <h2 className="font-rounded text-3xl font-bold text-gray-800">診断結果</h2>
              </div>

              <div className={`bg-gradient-to-r ${result.color} mb-6 rounded-2xl p-8 text-white`}>
                <h3 className="mb-4 text-2xl font-bold">{result.type}</h3>
                <p className="text-lg leading-relaxed">{result.description}</p>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-green-50 p-4">
                  <TrendingUp className="mx-auto mb-2 h-6 w-6 text-green-500" />
                  <h4 className="mb-2 font-semibold text-gray-800">収入目安</h4>
                  <p className="font-bold text-green-600">{result.income}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <CheckCircle className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                  <h4 className="mb-2 font-semibold text-gray-800">おすすめの特徴</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {result.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <button className="mr-4 rounded-full bg-pink-500 px-8 py-3 text-white transition-colors hover:bg-pink-600">
                  この結果で相談してみる
                </button>
                <button
                  onClick={resetDiagnosis}
                  className="rounded-full bg-gray-500 px-8 py-3 text-white transition-colors hover:bg-gray-600"
                >
                  もう一度診断する
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="diagnosis" className="bg-gradient-to-b from-pink-50 to-purple-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-rounded text-3xl font-bold text-gray-800 md:text-4xl">
            Style Finder
          </h2>
          <p className="font-serif text-xl text-gray-600">
            30秒でわかる、あなたにぴったりの働き方診断🍓
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  質問 {currentQuestion + 1} / {questions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-pink-500 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h3 className="mb-4 text-xl font-bold text-gray-800">
                {questions[currentQuestion].question}
              </h3>
            </div>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="group flex w-full items-center justify-between rounded-xl bg-gray-50 p-4 text-left transition-colors hover:bg-pink-50"
                >
                  <span className="text-gray-700">{option}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-pink-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkStyleDiagnosis;
