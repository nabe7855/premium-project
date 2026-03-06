'use client';

import { CancellationPolicy } from '@/types/priceConfig';
import { Trash2 } from 'lucide-react';

interface CancellationPolicyEditorProps {
  policy: CancellationPolicy;
  onUpdate: (policy: CancellationPolicy) => void;
}

export default function CancellationPolicyEditor({
  policy,
  onUpdate,
}: CancellationPolicyEditorProps) {
  const updateTokyo23kuTitle = (title: string) => {
    onUpdate({
      ...policy,
      tokyo23ku: { ...policy.tokyo23ku, title },
    });
  };

  const updateTokyo23kuRule = (index: number, field: 'period' | 'fee', value: string) => {
    const newRules = [...policy.tokyo23ku.rules];
    newRules[index] = { ...newRules[index], [field]: value };
    onUpdate({
      ...policy,
      tokyo23ku: { ...policy.tokyo23ku, rules: newRules },
    });
  };

  const addRule = () => {
    const newRules = [...policy.tokyo23ku.rules, { period: '', fee: '' }];
    onUpdate({
      ...policy,
      tokyo23ku: { ...policy.tokyo23ku, rules: newRules },
    });
  };

  const removeRule = (index: number) => {
    const newRules = policy.tokyo23ku.rules.filter((_, i) => i !== index);
    onUpdate({
      ...policy,
      tokyo23ku: { ...policy.tokyo23ku, rules: newRules },
    });
  };

  const updateOutside23ku = (field: 'title' | 'description', value: string) => {
    onUpdate({
      ...policy,
      outside23ku: { ...policy.outside23ku, [field]: value },
    });
  };

  const updateReschedule = (reschedule: string) => {
    onUpdate({ ...policy, reschedule });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-rounded text-lg font-bold text-rose-900">ご変更・キャンセルについて</h3>

      {/* エリア1 (旧名: 東京23区内) */}
      <div className="rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-rose-700">地域A のタイトル</label>
          <input
            type="text"
            value={policy.tokyo23ku.title}
            onChange={(e) => updateTokyo23kuTitle(e.target.value)}
            className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
            placeholder="例: 東京23区内の場合 / 福岡市内の場合"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-rose-700">キャンセル料金規定</label>
            <button
              onClick={addRule}
              className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-200"
            >
              + 規定を追加
            </button>
          </div>
          {policy.tokyo23ku.rules.map((rule, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={rule.period}
                  onChange={(e) => updateTokyo23kuRule(index, 'period', e.target.value)}
                  className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                  placeholder="期間 (例: 当日指定時刻の5時間前まで)"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={rule.fee}
                  onChange={(e) => updateTokyo23kuRule(index, 'fee', e.target.value)}
                  className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                  placeholder="料金 (例: 無料)"
                />
              </div>
              <button
                onClick={() => removeRule(index)}
                className="rounded-xl bg-red-50 p-3 text-red-500 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* エリア2 (旧名: 東京23区外) */}
      <div className="rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-rose-700">地域B のタイトル</label>
          <input
            type="text"
            value={policy.outside23ku.title}
            onChange={(e) => updateOutside23ku('title', e.target.value)}
            className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
            placeholder="例: 東京23区外の場合 / 福岡市外の場合"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-rose-700">地域B の説明</label>
          <textarea
            value={policy.outside23ku.description}
            onChange={(e) => updateOutside23ku('description', e.target.value)}
            rows={3}
            className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
            placeholder="遠方の場合などの規定を入力してください"
          />
        </div>
      </div>

      {/* 変更（延期）について */}
      <div className="rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-bold text-rose-700">
            日程変更 (延期) について
          </label>
          <textarea
            value={policy.reschedule}
            onChange={(e) => updateReschedule(e.target.value)}
            rows={2}
            className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
            placeholder="日程変更に関するルールを入力してください"
          />
        </div>
      </div>
    </div>
  );
}
