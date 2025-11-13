import React from 'react';
import { CastProfile, QuestionMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
  questionMasters: QuestionMaster[]; // ← DBから取得した質問一覧を渡す
}

export default function QuestionsSection({ form, onChange, questionMasters }: Props) {
  const answers = form.questions ?? {};

  return (
    <div>
      <label className="block text-lg font-bold mb-2">質問一覧</label>
      <div className="space-y-4">
        {questionMasters.map((q) => (
          <div key={q.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{q.text}</label>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) =>
                onChange('questions', { ...answers, [q.id]: e.target.value })
              }
              className="w-full rounded border px-3 py-2"
              rows={2}
              placeholder={`${q.text} を入力してください`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
