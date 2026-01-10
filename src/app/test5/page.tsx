'use client';

import AdminDashboard from '@/components/counseling&survey/AdminDashboard';
import CompleteView from '@/components/counseling&survey/CompleteView';
import CounselingView from '@/components/counseling&survey/CounselingView';
import IntroView from '@/components/counseling&survey/IntroView';
import SurveyView from '@/components/counseling&survey/SurveyView';
import TransitionView from '@/components/counseling&survey/TransitionView';
import { FORM_VERSION } from '@/data/counseling&survey';
import { AppView, CounselingData, SessionRecord, SurveyData } from '@/types/counseling&survey';
import { generateId, getDeviceType, saveRecord } from '@/utils/counseling&survey';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('intro');
  const [sessionId] = useState(generateId());
  const [nickname, setNickname] = useState('');

  const [counselingData, setCounselingData] = useState<Partial<CounselingData>>({});

  // Draft recovery from LocalStorage
  useEffect(() => {
    const draft = localStorage.getItem('counseling_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setCounselingData(parsed);
      } catch (e) {
        console.error('Draft recovery failed', e);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(counselingData).length > 0) {
      localStorage.setItem('counseling_draft', JSON.stringify(counselingData));
    }
  }, [counselingData]);

  const handleFinishCounseling = (data: CounselingData) => {
    setCounselingData(data);
    localStorage.removeItem('counseling_draft');
    setView('transition');
  };

  const finalizeRecord = (survey?: SurveyData, skipped = false) => {
    const record: SessionRecord = {
      id: sessionId,
      nickname: nickname || 'ゲスト',
      counseling: counselingData as CounselingData,
      survey: survey || (skipped ? ({ nickname, surveySkipped: true } as SurveyData) : undefined),
      createdAt: new Date().toISOString(),
      deviceType: getDeviceType(),
      formVersion: FORM_VERSION,
    };
    saveRecord(record);
    setView('complete');
  };

  const handleSkipSurvey = () => {
    finalizeRecord(undefined, true);
  };

  const handleFinishSurvey = (data: SurveyData) => {
    finalizeRecord(data, false);
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-md border-x bg-white shadow-sm">
      {/* Admin shortcut button (top right, discrete) */}
      <button
        onClick={() => setView('admin')}
        className="absolute right-4 top-4 text-xs text-gray-200 transition-colors hover:text-gray-400"
      >
        Admin
      </button>

      <main className="px-5 py-8">
        {view === 'intro' && (
          <IntroView
            onNext={() => setView('counseling')}
            nickname={nickname}
            setNickname={setNickname}
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
          <TransitionView onContinue={() => setView('survey')} onSkip={handleSkipSurvey} />
        )}

        {view === 'survey' && (
          <SurveyView
            nickname={nickname}
            onFinish={handleFinishSurvey}
            onBack={() => setView('transition')}
          />
        )}

        {view === 'complete' && <CompleteView />}

        {view === 'admin' && <AdminDashboard onBack={() => setView('intro')} />}
      </main>
    </div>
  );
};

export default App;
