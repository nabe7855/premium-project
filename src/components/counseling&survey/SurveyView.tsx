'use client';

import React, { useState } from 'react';
import { SURVEY_SECTIONS } from '../../data/counseling&survey';
import { SurveyData, SurveySection } from '../../types/counseling&survey';

interface Props {
  nickname: string;
  onFinish: (data: SurveyData) => void;
  onBack: () => void;
}

const SurveyView: React.FC<Props> = ({ nickname, onFinish, onBack }) => {
  const [data, setData] = useState<Partial<SurveyData>>({
    nickname: nickname,
    surveySkipped: false,
  });

  const updateValue = (key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key: string, value: string) => {
    const current = (data[key as keyof SurveyData] as string[]) || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateValue(key, next);
  };

  const handleSubmit = () => {
    onFinish(data as SurveyData);
  };

  return (
    <div className="animate-fadeIn space-y-10 pb-10">
      <header className="space-y-2">
        <h2 className="text-xl font-bold text-gray-800">任意アンケート</h2>
        <p className="text-xs text-gray-400">匿名・統計目的のみに使用します。</p>
      </header>

      {(SURVEY_SECTIONS as SurveySection[]).map((section) => (
        <section key={section.id} className="space-y-6">
          <h3 className="inline-block rounded bg-gray-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
            {section.title}
          </h3>

          <div className="space-y-8">
            {section.questions.map((q) => (
              <div key={q.id} className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">
                  {q.label}
                  <span className="ml-1 font-normal text-gray-400">(任意)</span>
                </label>

                {q.type === 'radio' && (
                  <div className="grid grid-cols-2 gap-2">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateValue(q.id, opt)}
                        className={`rounded-xl border px-3 py-3 text-left text-[13px] transition-all ${
                          data[q.id as keyof SurveyData] === opt
                            ? 'border-amber-400 bg-amber-50 font-medium text-amber-700 ring-1 ring-amber-400'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === 'checkbox' && (
                  <div className="grid grid-cols-2 gap-2">
                    {q.options?.map((opt) => {
                      const isSelected = (data[q.id as keyof SurveyData] as string[])?.includes(
                        opt,
                      );
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleArrayValue(q.id, opt)}
                          className={`rounded-xl border px-3 py-3 text-left text-[13px] transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-amber-50 font-medium text-amber-700 ring-1 ring-amber-400'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'scale' && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>{q.minLabel}</span>
                      <span>{q.maxLabel}</span>
                    </div>
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => updateValue(q.id, num)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-all ${
                            data[q.id as keyof SurveyData] === num
                              ? 'border-amber-500 bg-amber-500 font-bold text-white'
                              : 'border-gray-200 bg-white text-gray-400'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => updateValue(q.id, 'none')}
                        className={`flex h-10 items-center justify-center rounded-full border px-3 text-[10px] transition-all ${
                          data[q.id as keyof SurveyData] === 'none'
                            ? 'border-amber-500 bg-amber-500 font-bold text-white'
                            : 'border-gray-200 bg-white text-gray-400'
                        }`}
                      >
                        拒否
                      </button>
                    </div>
                  </div>
                )}

                {q.type === 'text' && (
                  <input
                    type="text"
                    value={(data[q.id as keyof SurveyData] as string) || ''}
                    onChange={(e) => updateValue(q.id, e.target.value)}
                    placeholder="回答を入力"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-200"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="space-y-3 pt-6">
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-gray-800 py-4 font-bold text-white shadow-lg transition-all active:scale-95"
        >
          アンケートを送信する
        </button>
        <button onClick={onBack} className="w-full bg-white py-3 text-sm font-bold text-gray-400">
          前の画面に戻る
        </button>
      </div>
    </div>
  );
};

export default SurveyView;
