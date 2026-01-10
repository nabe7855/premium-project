'use client';

import React, { useState } from 'react';
import { COUNSELING_SECTIONS } from '../../data/counseling&survey';
import { CounselingData, CounselingSection } from '../../types/counseling&survey';

interface Props {
  initialData: Partial<CounselingData>;
  onFinish: (data: CounselingData) => void;
  nickname: string;
}

const CounselingView: React.FC<Props> = ({ initialData, onFinish, nickname }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<CounselingData>>(initialData);

  const sections = COUNSELING_SECTIONS as CounselingSection[];
  const totalSteps = sections.length;
  const section = sections[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Add a final free-text step or just wrap up
      onFinish(data as CounselingData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const updateValue = (key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key: string, value: string) => {
    const current = (data[key as keyof CounselingData] as string[]) || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateValue(key, next);
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Progress Bar */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-gray-100">
        <div
          className="h-full bg-rose-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="space-y-2 pt-2">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
          <span className="text-xs font-medium text-gray-400">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {nickname ? `${nickname}様、` : ''}ご希望を詳しく教えてください。
        </p>
      </header>

      <div className="space-y-8">
        {section.questions.map((q) => (
          <div key={q.id} className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              {q.label}
              {!q.optional && <span className="ml-1 text-rose-500">*</span>}
            </label>
            {q.description && (
              <p className="text-xs leading-tight text-gray-400">{q.description}</p>
            )}

            {q.type === 'radio' && (
              <div className="grid grid-cols-1 gap-2">
                {q.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateValue(q.id, opt)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      data[q.id as keyof CounselingData] === opt
                        ? 'border-rose-400 bg-rose-50 text-rose-700 ring-1 ring-rose-400'
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
                  const isSelected = (data[q.id as keyof CounselingData] as string[])?.includes(
                    opt,
                  );
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleArrayValue(q.id, opt)}
                      className={`rounded-xl border px-3 py-3 text-left text-[13px] leading-tight transition-all ${
                        isSelected
                          ? 'border-rose-400 bg-rose-50 font-medium text-rose-700 ring-1 ring-rose-400'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'textarea' && (
              <textarea
                value={(data[q.id as keyof CounselingData] as string) || ''}
                onChange={(e) => updateValue(q.id, e.target.value)}
                rows={3}
                placeholder="具体的にあれば自由にご記入ください"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
              />
            )}

            {q.type === 'text' && (
              <input
                type="text"
                value={(data[q.id as keyof CounselingData] as string) || ''}
                onChange={(e) => updateValue(q.id, e.target.value)}
                placeholder="回答を入力してください"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
              />
            )}
          </div>
        ))}

        {currentStep === totalSteps - 1 && (
          <div className="space-y-3 border-t border-dashed pt-4">
            <label className="block text-sm font-bold text-gray-700">その他、備考 (任意)</label>
            <textarea
              value={data.additionalNotes || ''}
              onChange={(e) => updateValue('additionalNotes', e.target.value)}
              rows={3}
              placeholder="自由にご記入ください"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pb-10 pt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex-1 rounded-xl border py-4 font-bold transition-all ${
            currentStep === 0
              ? 'border-gray-100 bg-gray-50 text-gray-300'
              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 active:scale-95'
          }`}
        >
          戻る
        </button>
        <button
          onClick={handleNext}
          className="flex-[2] rounded-xl bg-gray-800 py-4 font-bold text-white shadow-lg transition-all active:scale-95"
        >
          {currentStep === totalSteps - 1 ? '内容を送信する' : '次へ進む'}
        </button>
      </div>
    </div>
  );
};

export default CounselingView;
