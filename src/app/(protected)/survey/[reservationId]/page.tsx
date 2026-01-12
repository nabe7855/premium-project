'use client';

import MultiSelect from '@/components/service-feedback/MultiSelect';
import ProgressBar from '@/components/service-feedback/ProgressBar';
import RatingSelect from '@/components/service-feedback/RatingSelect';
import {
  DESIRED_SERVICES,
  GOOD_POINTS,
  HP_CONTENTS,
  IMPROVEMENT_POINTS,
  SERVICE_IMPRESSIONS,
  SOURCES,
  STORE_IMPROVEMENTS,
  THERAPISTS,
} from '@/data/service-feedback';
import { getReservationDetails } from '@/lib/actions/consent';
import { saveSurvey } from '@/lib/actions/survey';
import { SurveyResponse } from '@/types/service-feedback';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  PencilLine,
  ShieldCheck,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const INITIAL_DATA: SurveyResponse = {
  sessionId: '',
  submittedAt: '',
  deviceType: '',
  formVersion: '1.0.0',
  overallSatisfaction: 'no_answer',
  repeatIntent: 'no_answer',
  recommendIntent: 'no_answer',
  blockAOther: '',
  bookingEase: 'no_answer',
  arrivalSupport: 'no_answer',
  siteUsability: 'no_answer',
  priceSatisfaction: 'no_answer',
  blockBOther: '',
  therapistName: '未選択',
  serviceImpression: [],
  technicalSatisfaction: 'no_answer',
  goodPoints: [],
  improvementPoints: [],
  blockCOther: '',
  storeImprovements: [],
  desiredServices: [],
  desiredHpContent: [],
  blockDOther: '',
  source: '答えたくない',
  searchKeyword: '',
  blockEOther: '',
  freeText: '',
  skippedFlag: false,
};

const SectionOtherInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = 'その他、お気づきの点があればご記入ください' }) => (
  <div className="mt-8 border-t border-slate-100 pt-6">
    <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-500">
      <PencilLine className="h-3.5 w-3.5" />
      自由記述（任意）
    </label>
    <input
      type="text"
      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-200"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params.reservationId as string;

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<SurveyResponse>(INITIAL_DATA);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      const data = await getReservationDetails(reservationId);
      if (!data) {
        toast.error('予約情報が見つかりません');
        return;
      }
      setIsLoading(false);
    };

    if (typeof window !== 'undefined') {
      setFormData((prev) => ({
        ...prev,
        sessionId: Math.random().toString(36).substring(7),
        submittedAt: new Date().toISOString(),
        deviceType: navigator.userAgent,
      }));
    }

    fetchReservation();
  }, [reservationId]);

  const updateField = (field: keyof SurveyResponse, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    console.log('Survey Submitted:', formData);

    const result = await saveSurvey({ ...formData, reservationId });

    if (result.success) {
      toast.success('アンケートを送信しました');
      setIsSubmitted(true);
    } else {
      toast.error('送信に失敗しました: ' + result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center duration-500 animate-in fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <CheckCircle2 className="h-10 w-10 text-indigo-600" />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-slate-800">回答ありがとうございました</h2>
        <p className="mb-8 leading-relaxed text-slate-600">
          ご協力いただいた内容は、今後のサービス改善の貴重な資料として活用させていただきます。
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-left">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            プライバシー保護について
          </h3>
          <p className="text-xs leading-relaxed text-slate-500">
            このアンケートは匿名で集計されています。回答内容によって特定の個人が特定されることはありません。
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={() => router.push('/cast/cast-dashboard')}
            className="rounded-full border border-indigo-100 px-6 py-3 text-sm font-bold text-indigo-600 transition-all hover:border-indigo-300 hover:bg-indigo-50"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <span className="rounded-lg bg-indigo-600 p-1.5">
              <MessageSquare className="h-5 w-5 text-white" />
            </span>
            <span className="hidden sm:inline">アフターアンケート</span>
            <span className="sm:hidden">アンケート</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8 pb-32">
        {step === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-center">
              <div className="rounded-full bg-indigo-50 p-3">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h2 className="mb-6 text-center text-xl font-bold text-slate-800">
              事後アンケートへのご協力
            </h2>

            <div className="mb-8 space-y-4">
              <div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">完全匿名・任意です</p>
                  <p className="text-xs leading-relaxed text-emerald-700">
                    回答しないことによる不利益はありません。個人特定情報は収集せず、キャストの評価・処分にも使用しません。
                  </p>
                </div>
              </div>

              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>回答は統計データとしてのみ利用します。</li>
                <li>YouTube等で集計結果を紹介することがありますが、個別回答は公開しません。</li>
                <li>所要時間は約1分程度です。</li>
              </ul>
            </div>

            <button
              onClick={nextStep}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 transition-colors hover:bg-indigo-700"
            >
              アンケートを開始する
              <ArrowRight className="h-5 w-5" />
            </button>
          </section>
        ) : (
          <>
            <ProgressBar currentStep={step} totalSteps={6} />

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm duration-300 animate-in slide-in-from-right-4">
              {step === 1 && (
                <>
                  <h3 className="mb-6 text-lg font-bold text-slate-800">ブロックA：全体満足度</h3>
                  <RatingSelect
                    label="【 ご利用全体の満足度 】"
                    value={formData.overallSatisfaction}
                    onChange={(v) => updateField('overallSatisfaction', v)}
                  />
                  <RatingSelect
                    label="【 また利用したいと思いますか？ 】"
                    value={formData.repeatIntent}
                    onChange={(v) => updateField('repeatIntent', v)}
                  />
                  <RatingSelect
                    label="【 友人に勧めたいと思いますか？ 】"
                    value={formData.recommendIntent}
                    onChange={(v) => updateField('recommendIntent', v)}
                  />
                  <SectionOtherInput
                    value={formData.blockAOther || ''}
                    onChange={(v) => updateField('blockAOther', v)}
                    placeholder="全体の満足度に関して補足があればご記入ください"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="mb-6 text-lg font-bold text-slate-800">ブロックB：サービス品質</h3>
                  <RatingSelect
                    label="【 予約のしやすさ 】"
                    value={formData.bookingEase}
                    onChange={(v) => updateField('bookingEase', v)}
                  />
                  <RatingSelect
                    label="【 来店時の対応 】"
                    value={formData.arrivalSupport}
                    onChange={(v) => updateField('arrivalSupport', v)}
                  />
                  <RatingSelect
                    label="【 サイトの使いやすさ 】"
                    value={formData.siteUsability}
                    onChange={(v) => updateField('siteUsability', v)}
                  />
                  <RatingSelect
                    label="【 料金に対する満足度 】"
                    value={formData.priceSatisfaction}
                    onChange={(v) => updateField('priceSatisfaction', v)}
                  />
                  <SectionOtherInput
                    value={formData.blockBOther || ''}
                    onChange={(v) => updateField('blockBOther', v)}
                    placeholder="予約・来店・料金等について補足があればご記入ください"
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="mb-6 text-lg font-bold text-slate-800">
                    ブロックC：セラピストについて
                  </h3>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      【 担当セラピスト名（任意） 】
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
                      value={formData.therapistName}
                      onChange={(e) => updateField('therapistName', e.target.value)}
                    >
                      {THERAPISTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <MultiSelect
                    label="【 接客の印象（複数選択） 】"
                    options={SERVICE_IMPRESSIONS}
                    selectedValues={formData.serviceImpression}
                    onChange={(v) => updateField('serviceImpression', v)}
                  />

                  <RatingSelect
                    label="【 技術の満足度 】"
                    value={formData.technicalSatisfaction}
                    onChange={(v) => updateField('technicalSatisfaction', v)}
                  />

                  <MultiSelect
                    label="【 良かった点（複数選択） 】"
                    options={GOOD_POINTS}
                    selectedValues={formData.goodPoints}
                    onChange={(v) => updateField('goodPoints', v)}
                  />

                  <MultiSelect
                    label="【 もっとこうしてほしかった点（複数選択） 】"
                    options={IMPROVEMENT_POINTS}
                    selectedValues={formData.improvementPoints}
                    onChange={(v) => updateField('improvementPoints', v)}
                  />
                  <SectionOtherInput
                    value={formData.blockCOther || ''}
                    onChange={(v) => updateField('blockCOther', v)}
                    placeholder="セラピストの接客や技術について補足があればご記入ください"
                  />
                </>
              )}

              {step === 4 && (
                <>
                  <h3 className="mb-6 text-lg font-bold text-slate-800">
                    ブロックD：サービス改善・新企画
                  </h3>
                  <MultiSelect
                    label="【 当店のサービスで改善してほしい点 】"
                    options={STORE_IMPROVEMENTS}
                    selectedValues={formData.storeImprovements}
                    onChange={(v) => updateField('storeImprovements', v)}
                  />
                  <MultiSelect
                    label="【 こんなサービスがあったら嬉しいですか？ 】"
                    options={DESIRED_SERVICES}
                    selectedValues={formData.desiredServices}
                    onChange={(v) => updateField('desiredServices', v)}
                  />
                  <MultiSelect
                    label="【 HPに追加してほしいコンテンツ 】"
                    options={HP_CONTENTS}
                    selectedValues={formData.desiredHpContent}
                    onChange={(v) => updateField('desiredHpContent', v)}
                  />
                  <SectionOtherInput
                    value={formData.blockDOther || ''}
                    onChange={(v) => updateField('blockDOther', v)}
                    placeholder="その他、具体的な改善案や新サービスのご要望があればご記入ください"
                  />
                </>
              )}

              {step === 5 && (
                <>
                  <h3 className="mb-6 text-lg font-bold text-slate-800">ブロックE：流入経路</h3>
                  <div className="mb-6">
                    <p className="mb-3 text-sm font-semibold text-slate-700">
                      【 当店をどこで知りましたか？ 】
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SOURCES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateField('source', s)}
                          className={`rounded-full border px-4 py-2 text-xs transition-all ${
                            formData.source === s
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.source === 'ネット検索' && (
                    <div className="mb-4 duration-300 animate-in slide-in-from-top-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        【 ネット検索の場合の検索ワード（任意） 】
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-200"
                        placeholder="例: 新宿 マッサージ おすすめ"
                        value={formData.searchKeyword}
                        onChange={(e) => updateField('searchKeyword', e.target.value)}
                      />
                    </div>
                  )}
                  <SectionOtherInput
                    value={formData.blockEOther || ''}
                    onChange={(v) => updateField('blockEOther', v)}
                    placeholder="認知経路についてその他補足があればご記入ください"
                  />
                </>
              )}

              {step === 6 && (
                <>
                  <h3 className="mb-6 text-lg font-bold text-slate-800">ブロックF：自由記述</h3>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    【 ご意見・ご感想・お気づきの点など 】（任意）
                  </label>
                  <textarea
                    className="min-h-[160px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-200"
                    placeholder="サービス、設備、スタッフについて気になったことなど、何でも自由にご記入ください。"
                    value={formData.freeText}
                    onChange={(e) => updateField('freeText', e.target.value)}
                  />
                  <p className="mt-2 text-[10px] text-slate-400">
                    ※個人を特定できる情報（お名前、電話番号等）は記入しないでください。
                  </p>
                </>
              )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4 sm:static sm:border-t-0 sm:bg-transparent sm:p-0">
              <div className="mx-auto flex max-w-xl gap-3">
                <button
                  onClick={prevStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                  戻る
                </button>

                {step < 6 ? (
                  <button
                    onClick={nextStep}
                    className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-colors hover:bg-indigo-700"
                  >
                    次へ進む
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-colors hover:bg-indigo-700"
                  >
                    回答を送信する
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-400 sm:mt-4">
                ※各設問は任意です。回答したくない場合はそのまま次へ進めます。
              </p>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-6">
        <div className="mx-auto max-w-4xl text-center text-xs text-slate-400">
          <p>&copy; 2024 Service Improvement Feedback System. Completely Anonymous.</p>
        </div>
      </footer>
    </div>
  );
}
