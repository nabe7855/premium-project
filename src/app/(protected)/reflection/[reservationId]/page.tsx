'use client';

import { Layout } from '@/components/cast-reflection/Layout';
import { MultiSelect } from '@/components/cast-reflection/MultiSelect';
import { Rating } from '@/components/cast-reflection/Rating';
import {
  CUSTOMER_TRAITS_OPTIONS,
  IMPROVEMENT_OPTIONS,
  SUCCESS_OPTIONS,
} from '@/data/cast-reflection';
import { getReservationDetails } from '@/lib/actions/consent';
import { saveReflection } from '@/lib/actions/reflection';
import { ReflectionData } from '@/types/cast-reflection';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TextFieldName = 'successMemo' | 'nextAction' | 'customerAnalysis' | 'incidentDetail';

export default function ReflectionPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params.reservationId as string;

  const [reflection, setReflection] = useState<ReflectionData>({
    satisfaction: 3,
    safetyScore: 5,
    successPoints: [],
    successMemo: '',
    improvementPoints: [],
    nextAction: '',
    customerTraits: [],
    customerAnalysis: '',
    hasIncident: false,
    incidentDetail: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState<TextFieldName | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reservationInfo, setReservationInfo] = useState<any>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      const data = await getReservationDetails(reservationId);
      if (!data) {
        toast.error('予約情報が見つかりません');
        return;
      }
      setReservationInfo(data);
      setIsLoading(false);
    };

    fetchReservation();
  }, [reservationId]);

  const startVoiceInput = (fieldName: TextFieldName) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(
        'このブラウザは音声入力に対応していません。Chromeなどの対応ブラウザをご利用ください。',
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setActiveVoiceField(fieldName);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setReflection((prev) => ({
        ...prev,
        [fieldName]: prev[fieldName] ? `${prev[fieldName]!.trim()}。${transcript}` : transcript,
      }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      toast.error('音声認識エラーが発生しました');
      setActiveVoiceField(null);
    };

    recognition.onend = () => {
      setActiveVoiceField(null);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await saveReflection({ ...reflection, reservationId });

    if (result.success) {
      toast.success('振り返りを保存しました');
      setIsCompleted(true);
    } else {
      toast.error('保存に失敗しました: ' + result.error);
    }

    setIsSubmitting(false);
  };

  const VoiceButton = ({
    field,
    colorClass = 'rose',
  }: {
    field: TextFieldName;
    colorClass?: string;
  }) => (
    <button
      type="button"
      onClick={() => startVoiceInput(field)}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold transition-all ${
        activeVoiceField === field
          ? 'animate-pulse border-red-400 bg-red-500 text-white'
          : `bg-white text-${colorClass}-600 border-${colorClass}-200 hover:bg-${colorClass}-50`
      }`}
    >
      <svg
        className={`h-3 w-3 ${activeVoiceField === field ? 'animate-bounce' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
      {activeVoiceField === field ? '録音中...' : '音声入力'}
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-rose-500"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <Layout title="完了報告">
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center duration-700 animate-in fade-in slide-in-from-bottom-8">
          <div className="relative mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 shadow-xl shadow-emerald-100">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <svg
                  className="h-12 w-12 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg">
              <span className="text-lg">✨</span>
            </div>
          </div>

          <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-800">
            お疲れ様でした！
          </h2>

          <div className="mx-auto mb-8 h-1 w-12 rounded-full bg-emerald-200" />

          <p className="mb-10 text-lg font-medium leading-relaxed text-slate-600">
            今回の振り返りを次回に活かせるよう、
            <br />
            またしっかりやっていきましょう。
          </p>

          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => router.push('/cast/cast-dashboard')}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 font-bold text-white shadow-xl transition-all hover:bg-black active:scale-[0.98]"
            >
              ダッシュボードに戻る
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <p className="text-xs text-slate-400">データは正常に送信・同期されました</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="施術振り返り">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* A. Session Info */}
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                予約ID
              </p>
              <p className="text-sm font-medium text-slate-700">{reservationId}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                お客様名
              </p>
              <p className="text-xs text-slate-500">{reservationInfo?.customer_name || '未設定'}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              予約日時
            </p>
            <p className="text-sm font-bold text-slate-800">
              {reservationInfo?.reservation_datetime || '未設定'}
            </p>
          </div>
        </section>

        {/* B. Self-Evaluation */}
        <section>
          <Rating
            label="今日の満足度 (自己評価)"
            value={reflection.satisfaction}
            onChange={(v) => setReflection({ ...reflection, satisfaction: v })}
          />
          <Rating
            label="安全運用 (NG遵守/境界線)"
            value={reflection.safetyScore}
            onChange={(v) => setReflection({ ...reflection, safetyScore: v })}
          />
        </section>

        {/* C. Good Points */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">うまくいった点</label>
            <VoiceButton field="successMemo" colorClass="rose" />
          </div>
          <MultiSelect
            label=""
            options={SUCCESS_OPTIONS}
            selected={reflection.successPoints}
            onChange={(v) => setReflection({ ...reflection, successPoints: v })}
          />
          <textarea
            placeholder="一言メモ (任意・140字程度)"
            className={`h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 ${
              activeVoiceField === 'successMemo'
                ? 'border-red-300 ring-rose-100'
                : 'focus:ring-rose-200'
            }`}
            maxLength={140}
            value={reflection.successMemo}
            onChange={(e) => setReflection({ ...reflection, successMemo: e.target.value })}
          />
        </section>

        {/* D. Improvements */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">改善したい点</label>
            <VoiceButton field="nextAction" colorClass="slate" />
          </div>
          <MultiSelect
            label=""
            options={IMPROVEMENT_OPTIONS}
            selected={reflection.improvementPoints}
            onChange={(v) => setReflection({ ...reflection, improvementPoints: v })}
          />
          <textarea
            placeholder="次回の具体アクション (任意・140字程度)"
            className={`h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 ${
              activeVoiceField === 'nextAction'
                ? 'border-red-300 ring-slate-100'
                : 'focus:ring-slate-200'
            }`}
            maxLength={140}
            value={reflection.nextAction}
            onChange={(e) => setReflection({ ...reflection, nextAction: e.target.value })}
          />
        </section>

        {/* E. Customer Analysis */}
        <section className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-indigo-900">
              <span className="text-lg">🧐</span>
              お客様の様子・分析 (主観)
            </h3>
            <VoiceButton field="customerAnalysis" colorClass="indigo" />
          </div>
          <MultiSelect
            label="感じた特性"
            options={CUSTOMER_TRAITS_OPTIONS}
            selected={reflection.customerTraits}
            onChange={(v) => setReflection({ ...reflection, customerTraits: v })}
          />
          <textarea
            placeholder="お客様の反応や雰囲気、気づいたこと (音声入力可)"
            className={`h-28 w-full rounded-2xl border bg-white p-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 ${
              activeVoiceField === 'customerAnalysis'
                ? 'border-red-300 ring-2 ring-red-100'
                : 'border-indigo-200 focus:ring-indigo-200'
            }`}
            value={reflection.customerAnalysis}
            onChange={(e) => setReflection({ ...reflection, customerAnalysis: e.target.value })}
          />
        </section>

        {/* F. Incidents */}
        <section className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-bold text-orange-800">トラブル・懸念事項の有無</label>
            <div className="flex items-center gap-3">
              {reflection.hasIncident && <VoiceButton field="incidentDetail" colorClass="orange" />}
              <button
                type="button"
                onClick={() =>
                  setReflection({ ...reflection, hasIncident: !reflection.hasIncident })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${reflection.hasIncident ? 'bg-orange-500' : 'bg-slate-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reflection.hasIncident ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>
          {reflection.hasIncident && (
            <textarea
              placeholder="詳細を入力してください (体調不良、認識ズレなど)"
              className={`h-20 w-full rounded-xl border border-orange-200 bg-white p-3 text-sm shadow-sm transition-all focus:outline-none ${
                activeVoiceField === 'incidentDetail' ? 'border-red-300 ring-2 ring-orange-200' : ''
              }`}
              value={reflection.incidentDetail}
              onChange={(e) => setReflection({ ...reflection, incidentDetail: e.target.value })}
            />
          )}
        </section>

        {/* Submission */}
        <div className="pt-4">
          <button
            disabled={isSubmitting}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white shadow-lg transition-all ${
              isSubmitting
                ? 'cursor-not-allowed bg-slate-400'
                : 'bg-rose-500 shadow-rose-200 hover:bg-rose-600 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                送信中...
              </>
            ) : (
              '振り返りを完了する'
            )}
          </button>
          <p className="mt-4 text-center text-[10px] text-slate-400">入力時間の目安: 約90秒</p>
        </div>
      </form>
    </Layout>
  );
}
