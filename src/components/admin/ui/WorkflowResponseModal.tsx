'use client';

import { X } from 'lucide-react';
import React from 'react';

interface WorkflowResponseModalProps {
  stepId: string;
  stepLabel: string;
  data: any;
  onClose: () => void;
}

export const WorkflowResponseModal: React.FC<WorkflowResponseModalProps> = ({
  stepId,
  stepLabel,
  data,
  onClose,
}) => {
  const renderContent = () => {
    if (!data) return <p className="text-gray-500">回答データが見つかりませんでした</p>;

    if (stepId === 'consent') {
      return (
        <div className="space-y-3 text-sm">
          <Row label="お客様名" value={data.client_nickname} />
          <Row label="担当者" value={data.therapist_name} />
          <Row label="同意日" value={data.consent_date} />
          <Row label="18歳以上確認" value={data.is_over_18 ? '✅ 確認済み' : '❌ 未確認'} />
          <Row label="担当者誓約" value={data.therapist_pledge_agreed ? '✅ 同意済み' : '未'} />
          <Row label="ログID" value={data.log_id} />
          {data.consent_text_snapshot && (
            <details className="mt-2 text-slate-800">
              <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600">
                記録全文を見る
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-100 p-3 text-[10px] text-slate-700">
                {data.consent_text_snapshot}
              </pre>
            </details>
          )}
        </div>
      );
    }

    if (stepId === 'review') {
      const tags = (data.review_tag_links ?? [])
        .map((l: any) => l.review_tag_master?.name)
        .filter(Boolean);
      return (
        <div className="space-y-3 text-sm">
          <Row label="投稿者" value={data.user_name} />
          <Row label="評価" value={'🍓'.repeat(data.rating) + ` (${data.rating}/5)`} />
          {tags.length > 0 && (
            <Row label="タグ" value={tags.map((t: string) => `#${t}`).join(' ')} />
          )}
          <div>
            <p className="mb-1 text-xs font-bold text-gray-400">コメント</p>
            <p className="whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs italic text-slate-700">
              「{data.comment}」
            </p>
          </div>
        </div>
      );
    }

    if (stepId === 'survey') {
      return (
        <div className="space-y-3 text-sm">
          <Row label="総合満足度" value={`${data.overall_satisfaction ?? '-'} / 5`} />
          <Row label="リピート意向" value={data.repeat_intent ?? '-'} />
          <Row label="推奨意向" value={data.recommend_intent ?? '-'} />
          <Row label="施術印象" value={data.service_impression ?? '-'} />
          <Row label="技術満足度" value={`${data.technical_satisfaction ?? '-'} / 5`} />
          {data.free_text && (
            <div className="mt-2">
              <p className="mb-1 text-xs font-bold text-gray-400">自由記述</p>
              <p className="whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">
                {data.free_text}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (stepId === 'counseling') {
      const answers = data.answers ?? {};
      return (
        <div className="space-y-3 text-sm">
          <Row label="ニックネーム" value={answers.nickname ?? '-'} />
          {answers.counseling && (
            <div className="mt-3">
              <p className="mb-2 border-b border-pink-100 pb-1 text-xs font-bold uppercase tracking-widest text-pink-500">
                Counseling Responses
              </p>
              <div className="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
                {Object.entries(answers.counseling).map(([key, val]: [string, any]) => (
                  <div key={key} className="rounded-lg bg-slate-50 p-2">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs font-medium text-slate-800">{String(val) || '-'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {answers.survey && (
            <div className="mt-4">
              <p className="mb-2 border-b border-indigo-100 pb-1 text-xs font-bold uppercase tracking-widest text-indigo-500">
                Survey Responses
              </p>
              <div className="space-y-2">
                {Object.entries(answers.survey).map(([key, val]: [string, any]) => (
                  <div key={key} className="rounded-lg bg-slate-50 p-2">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs font-medium text-slate-800">{String(val) || '-'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <pre className="whitespace-pre-wrap text-[10px] text-gray-400">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[85vh] w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-800">{stepLabel}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-50 py-1 last:border-0">
      <span className="shrink-0 text-xs font-bold text-slate-400">{label}</span>
      <span className="text-right text-xs font-medium text-slate-800">{String(value)}</span>
    </div>
  );
}
