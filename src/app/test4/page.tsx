'use client';

import ProgressBar from '@/components/digital-consent-manager/ProgressBar';
import { GUIDELINES, THERAPIST_PLEDGE_TEXT } from '@/data/digital-consent-manager';
import { ConsentFormData, Step } from '@/types/digital-consent-manager';
import React, { useCallback, useState } from 'react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.GUIDELINES);
  const [formData, setFormData] = useState<ConsentFormData>({
    isOver18: null,
    clientNickname: '',
    therapistName: '',
    consentDate: new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }),
    guidelinesAgreed: new Array(GUIDELINES.length).fill(false),
    therapistPledgeAgreed: false,
    consentTextSnapshot: '',
    logId: '',
  });

  const generateLogId = useCallback(() => {
    return 'CP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }, []);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleGuidelineToggle = (index: number) => {
    const newAgreed = [...formData.guidelinesAgreed];
    newAgreed[index] = !newAgreed[index];
    setFormData({ ...formData, guidelinesAgreed: newAgreed });
  };

  const handleFinalSubmit = () => {
    // Snapshot the full consent text for legal record
    const snapshot = `
      【同意事項】
      ${GUIDELINES.map((g) => `- ${g.text}`).join('\n')}
      【誓約】
      - 担当者(${formData.therapistName}): ${THERAPIST_PLEDGE_TEXT}
      【署名】
      - お客様氏名: ${formData.clientNickname}
      - 18歳以上確認: 同意済み
      - 同意日時: ${formData.consentDate}
    `.trim();

    setFormData((prev) => ({
      ...prev,
      consentTextSnapshot: snapshot,
      logId: generateLogId(),
    }));
    nextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case Step.GUIDELINES:
        const allAgreed = formData.guidelinesAgreed.every((a) => a);
        return (
          <div className="space-y-6">
            <div className="mb-6 rounded-r-lg border-l-4 border-rose-500 bg-rose-50 p-4">
              <h2 className="mb-2 flex items-center font-bold text-rose-700">
                <i className="fas fa-shield-halved mr-2"></i>
                重要事項の確認
              </h2>
              <p className="text-xs leading-relaxed text-rose-600">
                安心・安全なサービス提供のため、以下の項目を一つずつご確認の上、チェックをお願いいたします。
              </p>
            </div>

            <div className="space-y-4">
              {GUIDELINES.map((item, idx) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
                    formData.guidelinesAgreed[idx]
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-rose-500 focus:ring-rose-400"
                    checked={formData.guidelinesAgreed[idx]}
                    onChange={() => handleGuidelineToggle(idx)}
                  />
                  <span className="select-none text-sm font-medium leading-relaxed">
                    {item.text}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={!allAgreed}
              className={`w-full rounded-xl py-4 font-bold shadow-lg transition-all ${
                allAgreed
                  ? 'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98]'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
            >
              次へ進む
            </button>
          </div>
        );

      case Step.CLIENT_INFO:
        const isClientValid =
          formData.isOver18 === true && formData.clientNickname.trim().length > 0;
        return (
          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">同意日付</label>
              <div className="w-full rounded-xl border border-gray-200 bg-gray-100 p-4 font-medium text-gray-500">
                {formData.consentDate}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">
                お名前（ニックネーム可）
              </label>
              <input
                type="text"
                placeholder="例：タナカ"
                className="w-full rounded-xl border-2 border-gray-200 p-4 transition-colors focus:border-rose-500 focus:outline-none"
                value={formData.clientNickname}
                onChange={(e) => setFormData({ ...formData, clientNickname: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">
                あなたは18歳以上（高校生を除く）ですか？
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData({ ...formData, isOver18: true })}
                  className={`rounded-xl border-2 py-4 font-bold transition-all ${
                    formData.isOver18 === true
                      ? 'border-rose-500 bg-rose-50 text-rose-600'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  はい (Yes)
                </button>
                <button
                  onClick={() => setFormData({ ...formData, isOver18: false })}
                  className={`rounded-xl border-2 py-4 font-bold transition-all ${
                    formData.isOver18 === false
                      ? 'border-gray-700 bg-gray-700 text-white'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  いいえ (No)
                </button>
              </div>
              {formData.isOver18 === false && (
                <p className="mt-2 text-xs font-bold text-red-500">
                  ※18歳未満の方はご利用いただけません。
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={prevStep}
                className="flex-1 rounded-xl border-2 border-gray-200 py-4 font-bold text-gray-500"
              >
                戻る
              </button>
              <button
                onClick={nextStep}
                disabled={!isClientValid}
                className={`flex-[2] rounded-xl py-4 font-bold shadow-lg transition-all ${
                  isClientValid
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'cursor-not-allowed bg-gray-300 text-gray-500'
                }`}
              >
                次へ進む
              </button>
            </div>
          </div>
        );

      case Step.THERAPIST_INFO:
        const isTherapistValid =
          formData.therapistName.trim().length > 0 && formData.therapistPledgeAgreed;
        return (
          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">担当者名</label>
              <input
                type="text"
                placeholder="担当セラピスト名を入力"
                className="w-full rounded-xl border-2 border-gray-200 p-4 transition-colors focus:border-rose-500 focus:outline-none"
                value={formData.therapistName}
                onChange={(e) => setFormData({ ...formData, therapistName: e.target.value })}
              />
            </div>

            <div className="space-y-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-6">
              <h3 className="flex items-center text-sm font-bold text-blue-700">
                <i className="fas fa-handshake mr-2"></i>
                担当者からの誓約
              </h3>
              <p className="text-sm font-medium italic leading-relaxed text-blue-800">
                「{THERAPIST_PLEDGE_TEXT}」
              </p>

              <label className="flex cursor-pointer items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-blue-300 text-blue-600"
                  checked={formData.therapistPledgeAgreed}
                  onChange={(e) =>
                    setFormData({ ...formData, therapistPledgeAgreed: e.target.checked })
                  }
                />
                <span className="text-sm font-bold text-blue-700">上記の誓約に同意します</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={prevStep}
                className="flex-1 rounded-xl border-2 border-gray-200 py-4 font-bold text-gray-500"
              >
                戻る
              </button>
              <button
                onClick={nextStep}
                disabled={!isTherapistValid}
                className={`flex-[2] rounded-xl py-4 font-bold shadow-lg transition-all ${
                  isTherapistValid
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'cursor-not-allowed bg-gray-300 text-gray-500'
                }`}
              >
                最終確認へ
              </button>
            </div>
          </div>
        );

      case Step.CONFIRMATION:
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-4 rounded-2xl border-2 border-gray-100 bg-gray-50 p-6 shadow-inner">
              <h3 className="flex justify-between border-b pb-3 font-bold text-gray-800">
                <span>内容の確認</span>
                <span className="text-xs text-rose-500">Final Preview</span>
              </h3>

              <div className="grid grid-cols-3 gap-y-4 text-sm">
                <div className="font-medium text-gray-400">お名前</div>
                <div className="col-span-2 font-bold">{formData.clientNickname}</div>

                <div className="font-medium text-gray-400">年齢確認</div>
                <div className="col-span-2 font-bold text-green-600">18歳以上 同意済み</div>

                <div className="font-medium text-gray-400">担当者</div>
                <div className="col-span-2 font-bold">{formData.therapistName}</div>

                <div className="font-medium text-gray-400">日付</div>
                <div className="col-span-2 font-bold">{formData.consentDate}</div>
              </div>

              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  AGREEMENT SUMMARY
                </p>
                <ul className="list-inside list-disc space-y-1 text-[11px] text-gray-600">
                  <li>本番行為一切禁止への同意</li>
                  <li>迷惑行為・強要行為を行わない誓約</li>
                  <li>性的サービスの明示同意</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="flex-1 rounded-xl border-2 border-gray-200 py-4 font-bold text-gray-500"
              >
                修正する
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-rose-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-rose-700 active:scale-95"
              >
                <i className="fas fa-file-signature"></i>
                同意を確定し送信
              </button>
            </div>
            <p className="px-4 text-center text-[10px] leading-relaxed text-gray-400">
              送信ボタンをタップすることで、上記内容が電磁的記録として保存されることに同意したとみなされます。
            </p>
          </div>
        );

      case Step.COMPLETED:
        return (
          <div className="relative animate-[fadeIn_0.8s_ease-out] space-y-10 overflow-hidden py-12 text-center">
            {/* Background Decorative Elements */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-10">
              <div className="absolute left-10 top-10 h-20 w-20 animate-pulse rounded-full border-4 border-rose-400"></div>
              <div className="absolute bottom-10 right-10 h-32 w-32 animate-bounce rounded-full border-2 border-rose-300"></div>
              <div className="absolute left-1/4 top-1/2 h-12 w-12 rotate-45 border-l-4 border-t-4 border-rose-200"></div>
            </div>

            <div className="relative mb-6 inline-block scale-110">
              <div className="mx-auto flex h-28 w-28 animate-[sparkle_2s_infinite] items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-2xl">
                <i className="fas fa-heart text-5xl text-white drop-shadow-lg"></i>
              </div>
              <div className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full border-4 border-rose-100 bg-white shadow-lg">
                <i className="fas fa-crown text-sm text-rose-500"></i>
              </div>
            </div>

            <div className="space-y-4 px-4">
              <h2 className="bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-3xl font-black leading-tight text-transparent">
                本日は誠に
                <br />
                ありがとうございます
              </h2>
              <div className="mx-auto h-1 w-16 rounded-full bg-rose-200"></div>
              <p className="text-md font-bold leading-relaxed text-gray-700">
                全ての同意事項が確認されました。
                <br />
                どうぞ、安らぎに満ちた
                <br />
                <span className="text-rose-500">素敵なひととき</span>をお過ごしください。
              </p>
            </div>

            <div className="relative z-10 mx-auto max-w-[280px] rounded-3xl border border-rose-50 bg-white/50 p-6 shadow-lg backdrop-blur-sm">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Digital Access Token
              </p>
              <p className="flex items-center justify-center gap-3 font-mono text-2xl font-black tracking-wider text-rose-900">
                <span className="text-sm text-rose-300">ID:</span>
                {formData.logId}
              </p>
              <div className="mt-4 border-t border-rose-50 pt-4">
                <p className="text-[10px] font-medium text-rose-400">
                  {formData.consentDate} 正式受理
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => window.location.reload()}
                className="group mx-auto flex items-center justify-center gap-2 rounded-full border border-rose-100 px-6 py-3 text-xs font-bold text-rose-300 transition-all duration-300 hover:border-rose-300 hover:text-rose-500"
              >
                <i className="fas fa-rotate-right transition-transform duration-500 group-hover:rotate-180"></i>
                新規同意フォームへ
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="relative flex h-full min-h-[600px] w-full max-w-md flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl shadow-rose-100 md:h-auto">
        {/* Header (Hidden on Completed for a cleaner 'gorgeous' look) */}
        {currentStep !== Step.COMPLETED && (
          <div className="relative bg-rose-600 px-8 py-10 text-white">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <i className="fas fa-file-contract text-8xl"></i>
            </div>
            <h1 className="mb-1 flex items-center text-3xl font-black tracking-tighter">
              <i className="fas fa-shield-heart mr-3"></i>
              ConsentPlus
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-100 opacity-80">
              Digital Consent Protocol
            </p>
          </div>
        )}

        {/* Content Area */}
        <div
          className={`flex-grow p-8 ${currentStep === Step.COMPLETED ? 'bg-gradient-to-b from-white to-rose-50/30' : ''}`}
        >
          <ProgressBar currentStep={currentStep} />
          {renderStep()}
        </div>

        {/* Footer info (only on some steps) */}
        {currentStep !== Step.COMPLETED && (
          <div className="border-t border-gray-100 bg-gray-50 p-6 text-center">
            <p className="text-[10px] font-medium text-gray-400">
              Powered by SecureLog Engine v1.0 • TLS 1.3 Encrypted
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sparkle {
          0%, 100% { box-shadow: 0 0 20px rgba(244, 63, 94, 0.4); }
          50% { box-shadow: 0 0 40px rgba(244, 63, 94, 0.7), 0 0 10px rgba(255, 255, 255, 0.5); }
        }
      `}</style>
    </div>
  );
};

export default App;
