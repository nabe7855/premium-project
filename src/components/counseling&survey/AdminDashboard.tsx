'use client';

import React, { useEffect, useState } from 'react';
import { SessionRecord } from '../../types/counseling&survey';
import { getRecords } from '../../utils/counseling&survey';
import { analyzeCounselingForTherapist } from '../../utils/geminiService';

interface Props {
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<SessionRecord | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const handleRecordClick = (record: SessionRecord) => {
    setSelectedRecord(record);
    setAiSummary('');
  };

  const handleAiAnalyze = async () => {
    if (!selectedRecord) return;
    setIsAnalyzing(true);
    const summary = await analyzeCounselingForTherapist(selectedRecord.counseling);
    setAiSummary(summary);
    setIsAnalyzing(false);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Nickname', 'CreatedAt', 'MassageType', 'NGItems', 'SurveySkipped'];
    const rows = records.map((r) => [
      r.id,
      r.nickname,
      r.createdAt,
      r.counseling.massageType,
      (r.counseling.ngItems || []).join('/'),
      r.survey?.surveySkipped ? 'Yes' : 'No',
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `records_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="animate-fadeIn mx-auto max-w-4xl space-y-8 pb-20">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Management Console</h1>
          <p className="text-xs text-gray-400">Therapist View</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="rounded bg-gray-100 px-3 py-1.5 text-xs transition-colors hover:bg-gray-200"
          >
            CSV Export
          </button>
          <button
            onClick={onBack}
            className="rounded bg-rose-50 px-3 py-1.5 text-xs text-rose-500 transition-colors hover:bg-rose-100"
          >
            Close
          </button>
        </div>
      </div>

      {!selectedRecord ? (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase text-gray-500">Recent Sessions</h2>
          <div className="divide-y rounded-xl border bg-white">
            {records.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-400">No records found.</div>
            ) : (
              records.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleRecordClick(r)}
                  className="group flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-gray-800">{r.nickname}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${r.survey?.surveySkipped ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-600'}`}
                    >
                      {r.survey?.surveySkipped ? 'Skipped' : 'Survey OK'}
                    </span>
                    <svg
                      className="h-4 w-4 text-gray-300 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedRecord(null)}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-gray-800">
              {selectedRecord.nickname} さんのカルテ
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <section className="space-y-4 rounded-2xl border border-rose-100 bg-rose-50 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-rose-800">AI Therapist Assistant</h3>
                  <button
                    onClick={handleAiAnalyze}
                    disabled={isAnalyzing}
                    className="rounded-full bg-rose-200 px-2 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-300 disabled:opacity-50"
                  >
                    {isAnalyzing ? '分析中...' : '再分析する'}
                  </button>
                </div>
                <div className="min-h-[100px] whitespace-pre-wrap text-xs leading-relaxed text-rose-700">
                  {aiSummary || (
                    <div className="flex flex-col items-center justify-center py-4 italic text-rose-300">
                      「分析」ボタンを押してサマリーを生成
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase text-gray-400">Boundary Check</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-gray-400">NG Items</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedRecord.counseling.ngItems?.length ? (
                        selectedRecord.counseling.ngItems.map((ng) => (
                          <span
                            key={ng}
                            className="rounded bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600"
                          >
                            {ng}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-300">None</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">
                      Allowable Actions (セラピストへの行為)
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedRecord.counseling.allowableActions?.length ? (
                        selectedRecord.counseling.allowableActions.map((act) => (
                          <span
                            key={act}
                            className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-600"
                          >
                            {act}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-300">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="max-h-[600px] space-y-6 overflow-y-auto rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase text-gray-400">Counseling Details</h3>
              {Object.entries(selectedRecord.counseling).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400">{key.toUpperCase()}</p>
                  <p className="text-sm text-gray-700">
                    {Array.isArray(value)
                      ? value.join(', ')
                      : typeof value === 'object'
                        ? JSON.stringify(value)
                        : value.toString()}
                  </p>
                </div>
              ))}
              {selectedRecord.survey && !selectedRecord.survey.surveySkipped && (
                <>
                  <hr className="border-gray-100" />
                  <h3 className="text-xs font-bold uppercase text-gray-400">
                    Survey (Optional Data)
                  </h3>
                  {Object.entries(selectedRecord.survey).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400">{key.toUpperCase()}</p>
                      <p className="text-sm text-gray-700">
                        {Array.isArray(value) ? value.join(', ') : value.toString()}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
