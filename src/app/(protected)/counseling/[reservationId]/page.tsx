'use client';

import CompleteView from '@/components/counseling&survey/CompleteView';
import CounselingView from '@/components/counseling&survey/CounselingView';
import IntroView from '@/components/counseling&survey/IntroView';
import SurveyView from '@/components/counseling&survey/SurveyView';
import TransitionView from '@/components/counseling&survey/TransitionView';
import { getReservationDetails, submitCounselingResult } from '@/lib/actions/counseling';
import { AppView, CounselingData, SurveyData } from '@/types/counseling&survey';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CounselingPage() {
  const params = useParams();
  const reservationId = params.reservationId as string;

  const [view, setView] = useState<AppView>('intro');
  const [reservation, setReservation] = useState<any>(null);
  const [nickname, setNickname] = useState('');
  const [counselingData, setCounselingData] = useState<Partial<CounselingData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (reservationId) {
        const data = await getReservationDetails(reservationId);
        if (data) {
          setReservation(data);
          // 予約者名がある程度わかっている場合はニックネームの初期値にする
          setNickname(data.customer_name || '');
        }
      }
      setLoading(false);
    }
    init();
  }, [reservationId]);

  const handleFinishCounseling = (data: CounselingData) => {
    setCounselingData(data);
    setView('transition');
  };

  const finalizeRecord = async (survey?: SurveyData) => {
    setLoading(true);
    try {
      const result = await submitCounselingResult(
        reservationId,
        nickname,
        counselingData as CounselingData,
        survey,
      );
      if (result.success) {
        setView('complete');
      } else {
        alert('保存に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  if (loading && view === 'intro') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!reservation && !loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="mb-2 text-xl font-bold text-gray-800">予約が見つかりません</h1>
        <p className="text-sm text-gray-500">URLが正しいかご確認ください。</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-md border-x bg-white shadow-sm">
      <main className="px-5 py-8">
        {view === 'intro' && (
          <IntroView
            onNext={() => setView('counseling')}
            nickname={nickname}
            setNickname={setNickname}
            // 担当キャスト名などを渡せるように IntroView を拡張するのも良い
          />
        )}

        {view === 'counseling' && (
          <CounselingView
            initialData={counselingData}
            onFinish={handleFinishCounseling}
            nickname={nickname}
          />
        )}

        {view === 'transition' && (
          <TransitionView onContinue={() => setView('survey')} onSkip={() => finalizeRecord()} />
        )}

        {view === 'survey' && (
          <SurveyView
            nickname={nickname}
            onFinish={(data) => finalizeRecord(data)}
            onBack={() => setView('transition')}
          />
        )}

        {view === 'complete' && <CompleteView />}
      </main>
    </div>
  );
}
